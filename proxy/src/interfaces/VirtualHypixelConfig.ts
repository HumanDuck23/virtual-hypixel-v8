export interface VirtualHypixelConfig {
    server: {
        motd: string,
        maxPlayers: number,
        port: number,
        target: string,
        favicon: string
    },

    accounts: {
        [key: string]: {
            email: string,
            password: string
        }
    },

    modules: {
        path: string,
        configs: {
            [key: string]: {
                [key: string]: any
            }
        }
    }
}