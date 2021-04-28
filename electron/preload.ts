import { contextBridge, ipcRenderer } from 'electron';
import { IPCRendererEventCallback } from '../types/IPCRendererEventCallback';
import MessageData from '../types/MessageData';

contextBridge.exposeInMainWorld('electron', {
  onUpdate: (doThis: IPCRendererEventCallback) => ipcRenderer.on('update', doThis),
  sendMessage: (message: MessageData) => ipcRenderer.send('async-message', message)
});
