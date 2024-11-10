import { contextBridge, ipcRenderer } from 'electron'
// Expose ipcRenderer.invoke via preload
contextBridge.exposeInMainWorld('api', {
    selectFolder: () => ipcRenderer.invoke('selectFolder'),

    isDirectory: (path: string) => ipcRenderer.invoke('isDirectory', path),
    readDir: (folderPath: string) => ipcRenderer.invoke('readDir', folderPath),
    fileSize: (filePath: string) => ipcRenderer.invoke('fileSize', filePath)
})