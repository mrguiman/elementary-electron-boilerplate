import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fork } from 'child_process';
import { ChildProcess } from 'node:child_process';
import MessageData from '../types/MessageData';
import EmitToneEvent from '../types/EmitToneEvent';

const audioEngine: ChildProcess = fork('build/audio/main.js', {
  execPath: './node_modules/.bin/elementary'
}).on('message', function (data) {
  console.log('[elementaryProcess] ' + data);
});

ipcMain.on('async-message', (_, messageData) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    switch (messageData.type) {
      case 'stop-sound':
        updateSound(window, 0);
        break;
      case 'emit-sound':
      default:
        updateSound(window, 1);
        break;
    }
  }
});

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
  win.webContents.on('before-input-event', (_, input) => handleKeyboardEvents(win, input));
}

function updateSound(win: BrowserWindow, gain: number, frequency: number = 440) {
  audioEngine.send(
    new MessageData<EmitToneEvent>('emit-tone', {
      gain: gain,
      frequency: frequency
    })
  );

  updateRenderer(win, 'update-tone', gain > 0 ? frequency : null);
}

function updateRenderer(window: BrowserWindow, eventType: string, data: unknown) {
  window.webContents.send('update', {
    type: eventType,
    data
  });
}

function handleKeyboardEvents(win: BrowserWindow, input: Electron.Input) {
  const gain = input.type === 'keyDown' ? 1 : 0;

  if (!input.isAutoRepeat && input.key === 'a') {
    updateSound(win, gain);
  }
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
