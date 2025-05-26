const API_BASE_URL = 'http://localhost:3001/api';

export interface PatientData {
  firstName: string;
  lastName: string;
  age: number;
  doctorName: string;
}

export interface DiagnosisItem {
  text: string;
  confidence: number;
}

export interface RecommendationItem {
  text: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SimilarCase {
  id: number;
  imageUrl: string;
  diagnosis: string;
  match: number;
  description: string;
}

export interface XrayAnalysis {
  diagnosis: DiagnosisItem[];
  recommendations: RecommendationItem[];
  similarCases: SimilarCase[];
  confidence: number;
  analysisDate: string;
}

export interface XrayAnalysisResponse {
  success: boolean;
  analysis?: XrayAnalysis;
  imageUrl?: string;
  timestamp: string;
  processingTime?: string;
  error?: string;
  details?: string;
}

export interface ApiHealthResponse {
  status: string;
  message: string;
  timestamp: string;
  version: string;
  huggingFaceEnabled: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Проверка здоровья API
  async checkHealth(): Promise<ApiHealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка проверки здоровья API:', error);
      throw new Error('Не удалось подключиться к серверу');
    }
  }

  // Анализ рентген-снимка
  async analyzeXray(file: File, patientData: PatientData): Promise<XrayAnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('xrayImage', file);
      formData.append('firstName', patientData.firstName);
      formData.append('lastName', patientData.lastName);
      formData.append('age', patientData.age.toString());
      formData.append('doctorName', patientData.doctorName);

      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Ошибка анализа рентген-снимка:', error);
      throw error;
    }
  }

  // Получение похожих случаев
  async getSimilarCases(caseId: string): Promise<SimilarCase[]> {
    try {
      const response = await fetch(`${this.baseUrl}/similar-cases/${caseId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.similarCases || [];
    } catch (error) {
      console.error('Ошибка получения похожих случаев:', error);
      throw error;
    }
  }

  // Получение детального анализа
  async getDetailedAnalysis(imagePath: string, findings: string[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/detailed-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagePath,
          findings,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.detailedAnalysis || 'Детальный анализ недоступен';
    } catch (error) {
      console.error('Ошибка получения детального анализа:', error);
      throw error;
    }
  }

  // Получение статистики
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка получения статистики:', error);
      throw error;
    }
  }

  // Очистка старых файлов
  async cleanup() {
    try {
      const response = await fetch(`${this.baseUrl}/cleanup`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка очистки файлов:', error);
      throw error;
    }
  }
}

// Создаем единственный экземпляр сервиса
export const apiService = new ApiService();

// Утилитарные функции
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/dicom'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.dcm')) {
    return {
      isValid: false,
      error: 'Поддерживаются только файлы JPG, PNG, DICOM'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Файл слишком большой. Максимальный размер: ${formatFileSize(maxSize)}`
    };
  }

  return { isValid: true };
};

export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high':
      return '#ef4444'; // red-500
    case 'medium':
      return '#f59e0b'; // amber-500
    case 'low':
      return '#10b981'; // emerald-500
    default:
      return '#6b7280'; // gray-500
  }
};
