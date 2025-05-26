const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Запуск backend сервера...');

// Сначала собираем проект
console.log('📦 Сборка TypeScript...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Сборка завершена успешно');
    
    // Запускаем сервер
    console.log('🌟 Запуск сервера...');
    const serverProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });

    serverProcess.on('close', (serverCode) => {
      console.log(`Сервер завершен с кодом ${serverCode}`);
    });

  } else {
    console.error('❌ Ошибка при сборке');
    process.exit(1);
  }
});
