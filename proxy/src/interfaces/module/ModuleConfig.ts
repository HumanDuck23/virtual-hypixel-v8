export interface ModuleConfig {
    [key: string]: {
        type: "text" | "number" | "choice" | "bool" | "list" | "range",
        label: string,
        options?: string[],
        min?: number,
        max?: number
    }
}