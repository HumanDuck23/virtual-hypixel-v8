import { VirtualHypixel } from "./VirtualHypixel"
import * as fs from "fs"

const config = JSON.parse(fs.readFileSync("./vh-config.json", "utf8"))
const vh = new VirtualHypixel()
vh.start(config)
vh.loadModules()