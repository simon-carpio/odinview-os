import { app, BrowserWindow } from 'electron';
import path from 'path';
import { DatabaseManager } from './core/database';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  // In a later step, this will load from a file. For now, it can be empty.
  // mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
  // Get the standard user data path from Electron
  const userDataPath = app.getPath('userData');
  
  // Initialize our database manager. This must be done before creating the window
  // or any other logic that might need the database.
  DatabaseManager.getInstance(userDataPath);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS it's common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});