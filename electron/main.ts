import { fork } from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import { ChildProcess } from 'child_process';
import * as path from 'path';

import MessageData from '../types/MessageData';

const audioEngine: ChildProcess = fork('build/audio/main.js', {
  execPath: 'elementary'
}).on('message', function (messageData: MessageData) {
  const window = BrowserWindow.getFocusedWindow();
  window &&
    window.webContents.send('update', {
      type: messageData.type,
      value: messageData.value
    });
});

ipcMain.on('async-message', (_, messageData: MessageData) => audioEngine.send(messageData));

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  audioEngine.kill('SIGINT');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
