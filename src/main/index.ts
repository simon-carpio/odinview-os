import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { DatabaseManager } from './core/database';
import { KeyManager } from './core/key-manager';
import { ChatManager, ChatMessage } from './core/chat-manager';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // Load our new chat interface
  mainWindow.loadFile(path.join(__dirname, '../renderer/chat.html'));
}

// --- Main Application Logic ---
app.whenReady().then(() => {
  const userDataPath = app.getPath('userData');
  // Initialize singletons
  DatabaseManager.getInstance(userDataPath);
  const keyManager = KeyManager.getInstance();
  const chatManager = ChatManager.getInstance();

  // --- IPC Handlers ---
  ipcMain.handle('save-api-keys', async (event, keys) => {
    await keyManager.saveApiKeys(keys);
  });
  ipcMain.handle('get-api-keys', async () => {
    return await keyManager.getApiKeys();
  });
  ipcMain.handle('send-prompt', async (event, messages: ChatMessage[]) => {
    // The UI sends the entire conversation history, and the ChatManager handles the rest.
    return await chatManager.sendPrompt(messages);
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