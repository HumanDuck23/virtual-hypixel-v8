export interface VirtualHypixelConfig {
    server: {
        motd: string,
        maxPlayers: number,
        port: number,
        target: string
    },

    accounts: {
            [key: string]: string
    },

    modules: {
        [key: string]: {
            [key: string]: any
        }
    }
}