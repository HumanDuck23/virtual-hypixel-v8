const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("duckAPI", {
    getDuck: () => ipcRenderer.invoke("getDuck"),
})