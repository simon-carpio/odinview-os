"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIpcHandlers = setupIpcHandlers;
exports.removeIpcHandlers = removeIpcHandlers;
const electron_1 = require("electron");
const key_manager_1 = require("../core/key-manager");
const ipc_1 = require("../shared/ipc");
/**
 * Sets up all IPC handlers for the main process
 * This function should be called during app initialization
 */
function setupIpcHandlers() {
    const keyManager = key_manager_1.KeyManager.getInstance();
    // Handler for saving API keys
    electron_1.ipcMain.handle(ipc_1.IPC_CHANNELS.KEY_SAVE, async (event, service, apiKey) => {
        try {
            await keyManager.saveApiKey(service, apiKey);
            return {
                success: true
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    });
    // Handler for retrieving API keys
    electron_1.ipcMain.handle(ipc_1.IPC_CHANNELS.KEY_GET, async (event, service) => {
        try {
            const apiKey = await keyManager.getApiKey(service);
            return {
                success: true,
                data: apiKey
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    });
    // Handler for deleting API keys
    electron_1.ipcMain.handle(ipc_1.IPC_CHANNELS.KEY_DELETE, async (event, service) => {
        try {
            const deleted = await keyManager.deleteApiKey(service);
            return {
                success: true,
                data: deleted ? 'deleted' : 'not_found'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    });
}
/**
 * Removes all IPC handlers (useful for cleanup during testing)
 */
function removeIpcHandlers() {
    electron_1.ipcMain.removeAllListeners(ipc_1.IPC_CHANNELS.KEY_SAVE);
    electron_1.ipcMain.removeAllListeners(ipc_1.IPC_CHANNELS.KEY_GET);
    electron_1.ipcMain.removeAllListeners(ipc_1.IPC_CHANNELS.KEY_DELETE);
}
