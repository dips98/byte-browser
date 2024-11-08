import { contextBridge, ipcRenderer } from 'electron'
// Expose ipcRenderer.invoke via preload
contextBridge.exposeInMainWorld('api', {
    selectFolder: () => ipcRenderer.invoke('selectFolder')
})