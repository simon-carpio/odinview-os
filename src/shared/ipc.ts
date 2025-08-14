/**
 * Formal IPC Contract between Main and Renderer processes
 * This file defines all IPC communication interfaces and types
 */

// API Key Management Types
export interface ApiKeyRequest {
  service: string
  apiKey?: string
}

export interface ApiKeyResponse {
  success: boolean
  data?: string | null
  error?: string
}

// IPC Channel Constants
export const IPC_CHANNELS = {
  KEY_SAVE: 'key:save',
  KEY_GET: 'key:get',
  KEY_DELETE: 'key:delete',
} as const

// Type for IPC channel names
export type IPCChannelName = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS]

// Interface that will be exposed on window.electronAPI
export interface ElectronAPI {
  // Key Management API
  saveApiKey: (service: string, apiKey: string) => Promise<ApiKeyResponse>
  getApiKey: (service: string) => Promise<ApiKeyResponse>
  deleteApiKey: (service: string) => Promise<ApiKeyResponse>
}

// Extend the global Window interface to include our API
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}