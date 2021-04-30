import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fork } from 'child_process';
import { ChildProcess } from 'node:child_process';
import MessageData from '../types/MessageData';

const audioEngine: ChildProcess = fork('build/audio/main.js', {
  execPath: './node_modules/.bin/elementary'
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
