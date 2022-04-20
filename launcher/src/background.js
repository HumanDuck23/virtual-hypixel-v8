"use strict"

import { app, BrowserWindow, ipcMain, protocol, dialog } from "electron"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer"
import * as path from "path"
import axios from "axios"
import * as fs from "fs"

import * as stream from "stream"
import { promisify } from "util"

const finished = promisify(stream.finished)

function downloadFile(fileUrl, outputLocationPath) {
    console.log("downloading")
    console.log(fileUrl)
    console.log(outputLocationPath)
    const writer = fs.createWriteStream(outputLocationPath)
    return axios.get(fileUrl, { responseType: "stream" })
        .then(async response => {
            response.data.pipe(writer)
            return finished(writer) //this is a Promise
        })
}

const isDevelopment = process.env.NODE_ENV !== "production"

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        frame: false,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__static, "preload.js")
        }
    })

    ipcMain.handle("getDuck", () => {
        return new Promise((resolve, reject) => {
            axios.get("https://random-d.uk/api/v2/randomimg?type=jpg", { responseType: "arraybuffer" })
                .then(res => {
                    const img = Buffer.from(res.data, "binary").toString("base64")
                    // add base64 header to img string
                    resolve("data:image/png;base64," + img)
                })
                .catch(err => {
                    console.error(err)
                })
        })
    })

    ipcMain.handle("window", (event, arg) => {
        if (arg === "close") {
            win.close()
        } else if (arg === "minimize") {
            win.minimize()
        } else if (arg === "maximize") {
            if (win.isMaximized()) {
                win.unmaximize()
            } else {
                win.maximize()
            }
        } else if (arg === "folderDialog") {
            return new Promise(resolve => {
                dialog.showOpenDialog(win, {
                    properties: ["openDirectory"]
                })
                    .then(result => {
                        resolve(result.filePaths)
                    })
            })
        }
    })

    ipcMain.handle("binary", (event, ...arg) => {
        if (arg.length === 1) arg = arg[0]
        const exere = /virtual-hypixel-v8-proxy-(win|linux|macos)-(.*).exe/
        if (arg === "versionCheck") {
            for (const file of fs.readdirSync(__dirname)) {
                if (exere.exec(file)) {
                    // exe found
                    return exere.exec(file)[2]
                }
            }
            return -1
        } else if (arg[0] === "download") {
            return new Promise((resolve, reject) => {
                const _ = arg[1].split("/")
                downloadFile(arg[1], path.join(__dirname, _[_.length - 1]))
                    .then(() => {
                        resolve(true)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        } else if (arg === "deleteOld") {
            for (const file of fs.readdirSync(__dirname)) {
                if (exere.exec(file)) {
                    // exe found
                    fs.unlinkSync(path.join(__dirname, file))
                    return true
                }
            }
            return false
        }
    })

    ipcMain.handle("module", (event, ...arg) => {
        if (arg[0] === "getModules") {
            const dir = fs.readdirSync(arg[1])
            const list = []
            for (const module of dir) {
                const m = {
                    manifest: {},
                    config: {}
                }
                const moduleManifest = JSON.parse(fs.readFileSync(path.join(arg[1], module, "manifest.json")).toString())
                const moduleConfig = JSON.parse(fs.readFileSync(path.join(arg[1], module, "config.json")).toString())
                m.manifest = moduleManifest
                m.config = moduleConfig
                list.push(m)
            }
            return list
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol("app")
        // Load the index.html when not in development
        win.loadURL("app://./index.html")
    }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit()
            }
        })
    } else {
        process.on("SIGTERM", () => {
            app.quit()
        })
    }
}
