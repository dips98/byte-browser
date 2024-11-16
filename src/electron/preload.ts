import { contextBridge, ipcRenderer } from 'electron'
// Expose ipcRenderer.invoke via preload
contextBridge.exposeInMainWorld('api', {
    selectFolder: () => ipcRenderer.invoke('selectFolder'),

    callFolderStats: (path: string) => ipcRenderer.invoke('callFolderStats', path),
    onFolderStats: (callback: (value: string) => void) => ipcRenderer.on("onFolderStats", (_event, value) => callback(value)),
    killFolderStats: () => ipcRenderer.invoke('killFolderStats'),

    onUpdateProgress: (callback: (value: string) => void) => ipcRenderer.on("updateProgess", (_event, value) => callback(value)),
    importFile: () => ipcRenderer.invoke('importFile')
})