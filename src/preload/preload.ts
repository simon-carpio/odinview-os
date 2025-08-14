import { contextBridge, ipcRenderer } from 'electron'

// IPC Channel Constants (duplicated from shared/ipc.ts to avoid module resolution issues)
const IPC_CHANNELS = {
  KEY_SAVE: 'key:save',
  KEY_GET: 'key:get',
  KEY_DELETE: 'key:delete',
} as const

// API Response interface
interface ApiKeyResponse {
  success: boolean
  data?: string | null
  error?: string
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI = {
  saveApiKey: (service: string, apiKey: string): Promise<ApiKeyResponse> => {
    return ipcRenderer.invoke(IPC_CHANNELS.KEY_SAVE, service, apiKey)
  },

  getApiKey: (service: string): Promise<ApiKeyResponse> => {
    return ipcRenderer.invoke(IPC_CHANNELS.KEY_GET, service)
  },

  deleteApiKey: (service: string): Promise<ApiKeyResponse> => {
    return ipcRenderer.invoke(IPC_CHANNELS.KEY_DELETE, service)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)