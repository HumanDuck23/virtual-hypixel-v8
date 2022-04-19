const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("duckAPI", {
    getDuck: () => ipcRenderer.invoke("getDuck"),
})

contextBridge.exposeInMainWorld("windowAPI", {
    minimize: () => ipcRenderer.invoke("window", "minimize"),
    maximize: () => ipcRenderer.invoke("window", "maximize"),
    close: () => ipcRenderer.invoke("window", "close"),
})