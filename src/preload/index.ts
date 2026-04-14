import { contextBridge, ipcRenderer } from "electron"

// Type for the listener cleanup function
type Unsubscribe = () => void

const api = {
  // Vault operations
  openVault: (directPath?: string) => ipcRenderer.invoke("vault:open", directPath),
  initVault: (dirPath: string) => ipcRenderer.invoke("vault:init", dirPath),
  getCurrentVault: () => ipcRenderer.invoke("vault:current"),
  closeVault: () => ipcRenderer.invoke("vault:close"),

  // CLI operations
  runCommand: (command: string, args: string[] = []) =>
    ipcRenderer.invoke("cli:run", command, args),
  killCommand: (id: string) => ipcRenderer.invoke("cli:kill", id),

  // File picker
  pickIngestTargets: () => ipcRenderer.invoke("app:pick-ingest-targets"),

  // Graph server
  getGraphPort: () => ipcRenderer.invoke("graph:port"),

  // Wiki pages
  listPages: () => ipcRenderer.invoke("vault:list-pages"),
  readPage: (pagePath: string) => ipcRenderer.invoke("vault:read-page", pagePath),

  // Config
  readConfig: () => ipcRenderer.invoke("vault:read-config"),
  writeConfig: (content: string) => ipcRenderer.invoke("vault:write-config", content),

  // App state
  getRecentVaults: () => ipcRenderer.invoke("app:recent-vaults"),
  clearRecentVaults: () => ipcRenderer.invoke("app:clear-recent-vaults"),

  // Event listeners (return cleanup functions)
  onCommandOutput: (
    callback: (data: {
      id: string
      stream: "stdout" | "stderr"
      line: string
    }) => void,
  ): Unsubscribe => {
    const handler = (_event: Electron.IpcRendererEvent, data: unknown) =>
      callback(
        data as { id: string; stream: "stdout" | "stderr"; line: string },
      )
    ipcRenderer.on("cli:output", handler)
    return () => ipcRenderer.removeListener("cli:output", handler)
  },
  onCommandExit: (
    callback: (data: { id: string; code: number | null }) => void,
  ): Unsubscribe => {
    const handler = (_event: Electron.IpcRendererEvent, data: unknown) =>
      callback(data as { id: string; code: number | null })
    ipcRenderer.on("cli:exit", handler)
    return () => ipcRenderer.removeListener("cli:exit", handler)
  },

  // Menu event listeners
  onMenuEvent: (event: string, callback: () => void): Unsubscribe => {
    const handler = () => callback()
    ipcRenderer.on(event, handler)
    return () => ipcRenderer.removeListener(event, handler)
  },
}

contextBridge.exposeInMainWorld("swarmvault", api)
