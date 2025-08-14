import { ipcMain } from 'electron'
import { KeyManager } from '../core/key-manager'
import { IPC_CHANNELS, ApiKeyResponse } from '../shared/ipc'

/**
 * Sets up all IPC handlers for the main process
 * This function should be called during app initialization
 */
export function setupIpcHandlers(): void {
  const keyManager = KeyManager.getInstance()

  // Handler for saving API keys
  ipcMain.handle(IPC_CHANNELS.KEY_SAVE, async (event, service: string, apiKey: string): Promise<ApiKeyResponse> => {
    try {
      await keyManager.saveApiKey(service, apiKey)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  })

  // Handler for retrieving API keys
  ipcMain.handle(IPC_CHANNELS.KEY_GET, async (event, service: string): Promise<ApiKeyResponse> => {
    try {
      const apiKey = await keyManager.getApiKey(service)
      return {
        success: true,
        data: apiKey
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  })

  // Handler for deleting API keys
  ipcMain.handle(IPC_CHANNELS.KEY_DELETE, async (event, service: string): Promise<ApiKeyResponse> => {
    try {
      const deleted = await keyManager.deleteApiKey(service)
      return {
        success: true,
        data: deleted ? 'deleted' : 'not_found'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  })
}

/**
 * Removes all IPC handlers (useful for cleanup during testing)
 */
export function removeIpcHandlers(): void {
  ipcMain.removeAllListeners(IPC_CHANNELS.KEY_SAVE)
  ipcMain.removeAllListeners(IPC_CHANNELS.KEY_GET)
  ipcMain.removeAllListeners(IPC_CHANNELS.KEY_DELETE)
}