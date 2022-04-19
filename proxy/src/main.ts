import { VirtualHypixel } from "./VirtualHypixel"
import * as fs from "fs"
import { Logger } from "./utils/Logger"

if (!fs.existsSync("./vh-config.json")) {
    Logger.error("Config file not found!")
    process.exit(1)
}
const config = JSON.parse(fs.readFileSync("./vh-config.json", "utf8"))
const vh = new VirtualHypixel()
vh.start(config)
vh.loadModules()