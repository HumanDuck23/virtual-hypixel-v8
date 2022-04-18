import { VirtualHypixelConfig } from "./interfaces/VirtualHypixelConfig"
import { InstantConnectProxy } from "prismarine-proxy"
import { Client, PacketMeta } from "minecraft-protocol"

export class VirtualHypixel {

    version = "v8-beta-0.1.0"
    config: VirtualHypixelConfig | null = null

    proxy: InstantConnectProxy | null = null
    packetsStarted: boolean = false

    start(config: VirtualHypixelConfig) {
        this.config = config

        this.proxy = new InstantConnectProxy({
            loginHandler: ((client: Client) => {


                let credentials = null
                if (this.config?.accounts) {
                    for (const account in this.config.accounts) {
                        if (account === client.username) {
                            credentials = this.config.accounts[account]

                        }
                    }
                }

                if (credentials) {
                    return {
                        username: credentials.email,
                        password: credentials.password,
                        auth: "microsoft"
                    }
                } else {
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

        //@ts-ignore
        this.proxy.on("incoming", (data, meta, toClient, toServer) => {
            toClient.write(meta.name, data)
        })

        //@ts-ignore
        this.proxy.on("outgoing", (data, meta, toClient, toServer) => {
            toServer.write(meta.name, data)
        })
    }

    stop() {
        if (this.proxy) {
            this.proxy.server?.close()
            this.proxy = null
        }
    }

}