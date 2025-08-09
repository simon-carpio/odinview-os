import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { DatabaseManager } from './core/database';
import { KeyManager } from './core/key-manager';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // The preload script is essential for secure communication
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // Load the HTML file for our UI
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

// --- Main Application Logic ---
app.whenReady().then(() => {
  const userDataPath = app.getPath('userData');
  // Initialize singletons
  DatabaseManager.getInstance(userDataPath);
  const keyManager = KeyManager.getInstance();

  // --- IPC Handlers ---
  // These are the backend functions our UI can securely call
  ipcMain.handle('save-api-keys', async (event, keys) => {
    await keyManager.saveApiKeys(keys);
  });
  ipcMain.handle('get-api-keys', async () => {
    return await keyManager.getApiKeys();
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});