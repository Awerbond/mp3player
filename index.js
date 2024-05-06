const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const musicDir = path.join(__dirname, 'files');

// Получаем список файлов
const getMusicFiles = () => {
  return fs.readdirSync(musicDir).filter(file => file.endsWith('.mp3'));
};

// Создаём главное окно приложения
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Загружаем index.html в главное окно
  win.loadFile('index.html');

  // Получаем список музыкальных файлов и отправляем в рендерер процесс
  win.webContents.on('did-finish-load', () => {
    const musicFiles = getMusicFiles().map(file => {
      return { name: file, path: path.join(musicDir, file) };
    });
    win.webContents.send('musicFiles', musicFiles);
  });
};

app.whenReady().then(createWindow);