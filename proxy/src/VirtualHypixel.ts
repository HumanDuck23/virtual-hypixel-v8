import { VirtualHypixelConfig } from "./interfaces/VirtualHypixelConfig"
import { Client, PacketMeta } from "minecraft-protocol"
import { InstantConnectProxy } from "prismarine-proxy"
import { Module } from "./interfaces/module/Module"
import { Logger } from "./utils/Logger"
import * as path from "path"
import * as fs from "fs"

export class VirtualHypixel {

    version = "v8-beta-0.1.0"
    config: VirtualHypixelConfig | null = null

    proxy: InstantConnectProxy | null = null
    client: Client | null = null
    packetsStarted: boolean = false

    modules: Module[] = []

    start(config: VirtualHypixelConfig) {
        Logger.startup(`Starting VirtualHypixel ${this.version}...`)
        this.config = config

        this.proxy = new InstantConnectProxy({
            loginHandler: ((client: Client) => {
                this.client = client

                this.client.on("end", () => {
                    this.packetsStarted = false
                    for (const module of this.modules) {
                        if (module.instance.onDisconnect !== undefined && typeof module.instance.onDisconnect === "function") {
                            module.instance.onDisconnect()
                        }
                    }
                })

                let credentials = null
                if (this.config?.accounts) {
                    for (const account in this.config.accounts) {
                        if (account === client.username) {
                            credentials = this.config.accounts[account]

                        }
                    }
                }

                if (credentials) {
                    Logger.info(`Logging in ${client.username}...`)
                    return {
                        username: credentials.email,
                        password: credentials.password,
                        auth: "microsoft"
                    }
                } else {
                    Logger.error(`No credentials found for ${client.username}!`)
                    return { username: client.username, password: "", auth: "mojang" }
                }
            }),
            serverOptions: {
                motd: this.config.server.motd,
                maxPlayers: this.config.server.maxPlayers,
                port: this.config.server.port,
                favicon: this.config.server.favicon,
                version: "1.8.9"
            },
            clientOptions: {
                version: "1.8.9",
                host: this.config.server.target
            }
        })

        // @ts-ignore
        this.proxy.on("incoming", (data, meta, toClient, toServer) => {
            try {
                if (!this.packetsStarted) {
                    this.packetsStarted = true
                    for (const module of this.modules) {
                        if (module.instance.onConnect !== undefined && typeof module.instance.onConnect === "function") {
                            module.instance.onConnect()
                        }
                    }
                }

                const handled = this.handlePacket(meta, data, toServer, false)
                if (!handled.intercept) toClient.write(handled.meta.name, handled.data)
            } catch (e) {
                Logger.error(`Error while writing to client: ${e}`)
            }
        })

        // @ts-ignore
        this.proxy.on("outgoing", (data, meta, toClient, toServer) => {
            try {
                const handled = this.handlePacket(meta, data, toServer, true)
                if (!handled.intercept) toServer.write(handled.meta.name, handled.data)
            } catch (e) {
                Logger.error(`Error while writing to server: ${e}`)
            }
        })

        Logger.startup(`VirtualHypixel ${this.version} started! You can now connect to "localhost:${this.config.server.port}".`)
    }

    stop() {
        if (this.proxy) {
            this.proxy.server?.close()
            this.proxy = null
            Logger.info(`Stopped VirtualHypixel ${this.version}.`)
        }
    }

    loadModules() {
        Logger.info(`Loading modules...`)
        this.modules = []
        if (this.config) {
            if (fs.existsSync(this.config.modules?.path)) {
                const dirList = fs.readdirSync(this.config.modules?.path)
                for (const module of dirList) {
                    if (fs.lstatSync(path.join(this.config.modules?.path, module)).isDirectory()) {
                        try {
                            const moduleManifest = require(path.join(this.config.modules?.path, module, "manifest.json"))
                            const moduleConfig = require(path.join(this.config.modules?.path, module, "config.json"))
                            const moduleClass = require(path.join(this.config.modules?.path, module, "index.js"))
                            this.modules.push({
                                manifest: moduleManifest,
                                config: moduleConfig,
                                instance: new moduleClass(this.config.modules.configs[moduleManifest.id])
                            })
                            Logger.info(`Loaded module: ${moduleManifest.name} v${moduleManifest.version} by ${moduleManifest.author}!`)
                        } catch (e) {
                            Logger.error(`Error loading module ${module}: ${e}`)
                        }
                    }
                }
            } else {
                Logger.error(`Module path does not exist!`)
            }
        } else {
            Logger.error(`No config found!`)
        }
    }

    handlePacket(meta: PacketMeta, data: any, toServer: Client, out: boolean): { intercept: boolean, meta: PacketMeta, data: any } {
        let intercept = false

        for (const module of this.modules) {
            let applied = [false, data]
            if (out) {
                if (module.instance.onOutPacket !== undefined && typeof module.instance.onOutPacket === "function") {
                    applied = module.instance.onOutPacket(meta, data, toServer, this.client)
                    if (applied[0]) {
                        intercept = true
                    } else {
                        data = applied[1]
                    }
                }
            } else {
                if (module.instance.onInPacket !== undefined && typeof module.instance.onInPacket === "function") {
                    applied = module.instance.onInPacket(meta, data, toServer, this.client)
                    if (applied[0]) {
                        intercept = true
                    } else {
                        data = applied[1]
                    }
                }
            }
        }

        return { intercept, meta, data }
    }

}