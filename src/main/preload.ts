import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveApiKeys: (keys: { openai: string; gemini: string }) => 
    ipcRenderer.invoke('save-api-keys', keys),
  getApiKeys: () => 
    ipcRenderer.invoke('get-api-keys'),
});