import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { analyzeXrayImage, getDetailedAnalysis, getSimilarCases } from './services/aiService';
import { 
  XrayAnalysisRequest, 
  XrayAnalysisResponse, 
  SimilarCasesResponse,
  DetailedAnalysisResponse,
  StatsResponse,
  CleanupResponse
} from './types/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Создаем папку для загрузок если её нет
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|dcm|dicom/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/dicom';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Поддерживаются только файлы JPG, PNG, DICOM'));
    }
  }
});

// Статические файлы для загруженных изображений
app.use('/uploads', express.static(uploadsDir));

// Маршруты
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend работает',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    huggingFaceEnabled: !!process.env.HF_API_KEY
  });
});

// Основной маршрут для анализа рентген-снимков
app.post('/api/analyze', upload.single('xrayImage'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      res.status(400).json({ 
        success: false,
        error: 'Файл изображения не загружен',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const { firstName, lastName, age, doctorName } = req.body;

    // Валидация входных данных
    if (!firstName || !lastName || !age || !doctorName) {
      // Удаляем загруженный файл если валидация не прошла
      fs.unlinkSync(req.file.path);
      res.status(400).json({ 
        success: false,
        error: 'Все поля пациента обязательны',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const patientAge = parseInt(age);
    if (isNaN(patientAge) || patientAge < 0 || patientAge > 150) {
      fs.unlinkSync(req.file.path);
      res.status(400).json({ 
        success: false,
        error: 'Некорректный возраст пациента',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const analysisRequest: XrayAnalysisRequest = {
      imagePath: req.file.path,
      patientData: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: patientAge,
        doctorName: doctorName.trim()
      }
    };

    console.log(`Анализируем рентген-снимок: ${req.file.filename} для пациента ${firstName} ${lastName}, возраст ${age}`);
        
    // Анализируем изображение с помощью AI
    const analysisResult = await analyzeXrayImage(analysisRequest);

    const processingTime = Date.now() - startTime;
    console.log(`Анализ завершен за ${processingTime}ms`);

    const response: XrayAnalysisResponse = {
      success: true,
      analysis: analysisResult,
      imageUrl: `/uploads/${req.file.filename}`,
      timestamp: new Date().toISOString(),
      processingTime: `${processingTime}ms`
    };

    res.json(response);

  } catch (error) {
    console.error('Ошибка при анализе:', error);
    
    // Удаляем файл в случае ошибки
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Ошибка при удалении файла:', unlinkError);
      }
    }

    res.status(500).json({ 
      success: false,
      error: 'Ошибка при анализе изображения',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка',
      timestamp: new Date().toISOString()
    });
  }
});

// Маршрут для получения похожих случаев
app.get('/api/similar-cases/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    
    if (!caseId || isNaN(parseInt(caseId))) {
      res.status(400).json({ 
        success: false,
        error: 'Некорректный ID случая',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const similarCases = await getSimilarCases(`case_${caseId}`);
    
    const response: SimilarCasesResponse = { 
      success: true,
      similarCases,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Ошибка при получении похожих случаев:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка сервера при получении похожих случаев',
      timestamp: new Date().toISOString()
    });
  }
});

// Маршрут для детального анализа
app.post('/api/detailed-analysis', async (req, res) => {
  try {
    const { imagePath, findings } = req.body;

    if (!imagePath || !findings || !Array.isArray(findings)) {
      res.status(400).json({
        success: false,
        error: 'Требуются параметры imagePath и findings (массив)',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const detailedAnalysis = await getDetailedAnalysis(imagePath, findings);

    const response: DetailedAnalysisResponse = {
      success: true,
      detailedAnalysis,
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Ошибка при получении детального анализа:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении детального анализа',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка',
      timestamp: new Date().toISOString()
    });
  }
});

// Маршрут для получения статистики
app.get('/api/stats', (req, res) => {
  try {
    // Подсчитываем количество загруженных файлов
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.dcm', '.dicom'].includes(ext);
    });

    const response: StatsResponse = {
      success: true,
      stats: {
        totalAnalyses: imageFiles.length,
        huggingFaceEnabled: !!process.env.HF_API_KEY,
        serverUptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении статистики',
      timestamp: new Date().toISOString()
    });
  }
});

// Маршрут для очистки старых файлов (старше 24 часов)
app.post('/api/cleanup', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000); // 24 часа назад
    let deletedCount = 0;

    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime.getTime() < oneDayAgo) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    const response: CleanupResponse = {
      success: true,
      message: `Удалено ${deletedCount} старых файлов`,
      deletedCount,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Ошибка при очистке файлов:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при очистке файлов',
      timestamp: new Date().toISOString()
    });
  }
});

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Обработка ошибок
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ 
        success: false,
        error: 'Файл слишком большой (максимум 10MB)',
        timestamp: new Date().toISOString()
      });
      return;
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({ 
        success: false,
        error: 'Неожиданное поле файла',
        timestamp: new Date().toISOString()
      });
      return;
    }
  }
  
  console.error('Ошибка сервера:', error);
  res.status(500).json({ 
    success: false,
    error: 'Внутренняя ошибка сервера',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Получен сигнал SIGTERM, завершаем сервер...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Получен сигнал SIGINT, завершаем сервер...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend сервер запущен на порту ${PORT}`);
  console.log(`📁 Папка для загрузок: ${uploadsDir}`);
  console.log(`🤖 Hugging Face API: ${process.env.HF_API_KEY ? 'Включен' : 'Отключен'}`);
  console.log(`🌐 CORS разрешен для: ${process.env.CORS_ORIGIN || 'localhost:5173, localhost:3000'}`);
  console.log(`⏰ Сервер запущен: ${new Date().toISOString()}`);
});
