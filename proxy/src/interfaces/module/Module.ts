import { ModuleManifest } from "./ModuleManifest"
import { ModuleConfig } from "./ModuleConfig"

export interface Module {
    manifest: ModuleManifest,
    config: ModuleConfig,
    instance: any
}