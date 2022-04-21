const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("duckAPI", {
    getDuck: () => ipcRenderer.invoke("getDuck"),
})

contextBridge.exposeInMainWorld("windowAPI", {
    minimize: () => ipcRenderer.invoke("window", "minimize"),
    maximize: () => ipcRenderer.invoke("window", "maximize"),
    close: () => ipcRenderer.invoke("window", "close"),
    folderDialog: () => ipcRenderer.invoke("window", "folderDialog"),
})

contextBridge.exposeInMainWorld("binaryAPI", {
    versionCheck: () => ipcRenderer.invoke("binary", "versionCheck"),
    download: (url) => ipcRenderer.invoke("binary", "download", url),
    deleteOld: (url) => ipcRenderer.invoke("binary", "deleteOld"),
    startProxy: (config) => ipcRenderer.invoke("binary", "startProxy", config),
    stopProxy: () => ipcRenderer.invoke("binary", "stopProxy"),
})

contextBridge.exposeInMainWorld("moduleAPI", {
    getModules: (path) => ipcRenderer.invoke("module", "getModules", path),
})