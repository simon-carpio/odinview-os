"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// IPC Channel Constants (duplicated from shared/ipc.ts to avoid module resolution issues)
const IPC_CHANNELS = {
    KEY_SAVE: 'key:save',
    KEY_GET: 'key:get',
    KEY_DELETE: 'key:delete',
};
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI = {
    saveApiKey: (service, apiKey) => {
        return electron_1.ipcRenderer.invoke(IPC_CHANNELS.KEY_SAVE, service, apiKey);
    },
    getApiKey: (service) => {
        return electron_1.ipcRenderer.invoke(IPC_CHANNELS.KEY_GET, service);
    },
    deleteApiKey: (service) => {
        return electron_1.ipcRenderer.invoke(IPC_CHANNELS.KEY_DELETE, service);
    }
};
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
