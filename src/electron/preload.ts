import { contextBridge, ipcRenderer } from 'electron'
// Expose ipcRenderer.invoke via preload
contextBridge.exposeInMainWorld('api', {
    selectFolder: () => ipcRenderer.invoke('selectFolder'),

    getFolderStats: (path: string) => ipcRenderer.invoke('getFolderStats', path),
    onLogs: (callback: (value: string) => void) => ipcRenderer.on("onLogs", (_event, value) => callback(value)),

    onUpdateProgress: (callback: (value: string) => void) => ipcRenderer.on("updateProgess", (_event, value) => callback(value)),
    importFile: () => ipcRenderer.invoke('importFile')
})