import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { readFileSync } from 'original-fs';
import path from 'path';
import { autoUpdater } from "electron-updater"
import url from 'url';
import { Worker } from 'worker_threads'

if (process.platform === 'win32') {
  app.setAppUserModelId(app.name);
}

autoUpdater.addListener("update-available", (info) => {
  createUpdateWindow()
})
autoUpdater.addListener("download-progress", (info) => {
  updateWindow.webContents.send('updateProgess', info.percent)
})
autoUpdater.addListener("update-downloaded", () => {
  setTimeout(() => {
    updateWindow.closable = true
    updateWindow.close()
  }, 1500);
})
autoUpdater.checkForUpdatesAndNotify()

let mainWindow: Electron.BrowserWindow;
let updateWindow: Electron.BrowserWindow;
const assetsPath = process.argv.includes('--dev') ? '../src/assets' : 'browser/assets'
const indexUrl = url.format({
  pathname: path.join(__dirname, 'browser/index.html'),
  protocol: 'file',
  slashes: true,
  hash: '#'
})


//Main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    title: 'Byte Browser',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, assetsPath + '/icon.png')
  });
  mainWindow.removeMenu()

  if(process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:4200/#')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(indexUrl)
  }

  mainWindow.on('closed', () => {
    mainWindow.destroy()
  });
}

// Update window
function createUpdateWindow() {
  updateWindow = new BrowserWindow({
    height: 180,
    width: 500,
    resizable: false,
    closable: false,
    title: "Update found",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, assetsPath + '/icon.png')
  });
  updateWindow.removeMenu()
  if(process.argv.includes('--dev')) {
    updateWindow.loadURL('http://localhost:4200/#/update')
    updateWindow.webContents.openDevTools()
  } else {
    updateWindow.loadURL(indexUrl + '/update')
  }

  updateWindow.on('closed', () => {
    updateWindow.destroy()
  });

}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Listen for events with ipcMain.handle

ipcMain.handle('selectFolder', (event) => {
  const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
  if(result) return result[0]
  else return ''
})


ipcMain.handle('importFile', (event) => {
  const result = dialog.showOpenDialogSync({ properties: ['openFile'], filters: [ { name: 'Json', extensions: ['json'] }] })
  if(result && result[0])
    return readFileSync(result[0], 'utf-8')
  return ''
})

let worker: Worker
ipcMain.handle('callFolderStats', (event, thePath: string) => {
  worker = new Worker(path.join(__dirname, "worker.js"), { workerData: { thePath }})
  worker.once("message", (message) => {
    mainWindow.webContents.send('onFolderStats', message)
  })
})

ipcMain.handle('killFolderStats', (event) => {
  worker && worker.terminate()
})