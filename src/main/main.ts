import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { setupIpcHandlers } from './ipc-handlers'

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist-renderer/index.html'))
  }

  // Debug: Log preload script path
  console.log('Preload path:', path.join(__dirname, '../preload/preload.js'))

  // Redirect renderer console to terminal for debugging
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const levelMap = ['VERBOSE', 'INFO', 'WARNING', 'ERROR']
    console.log(`[Renderer ${levelMap[level] || 'LOG'}]: ${message}`)
    if (line && sourceId) {
      console.log(`  at ${sourceId}:${line}`)
    }
  })
}

app.whenReady().then(() => {
  // Set up IPC handlers before creating the window
  setupIpcHandlers()
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})