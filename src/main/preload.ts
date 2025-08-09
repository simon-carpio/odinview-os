import { contextBridge, ipcRenderer } from 'electron';

// This is the shape of the ChatMessage object we will pass between processes.
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

contextBridge.exposeInMainWorld('electronAPI', {
  // Key Management
  saveApiKeys: (keys: { openai: string; gemini: string }) => 
    ipcRenderer.invoke('save-api-keys', keys),
  getApiKeys: () => 
    ipcRenderer.invoke('get-api-keys'),
    
  // Chat Management
  sendPrompt: (messages: ChatMessage[]) => 
    ipcRenderer.invoke('send-prompt', messages),
});