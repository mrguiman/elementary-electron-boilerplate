import { IpcRendererEvent } from 'electron';

export type IPCRendererEventCallback = (event: IpcRendererEvent, ...args: any[]) => void;
