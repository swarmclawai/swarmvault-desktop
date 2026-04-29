type Unsubscribe = () => void

interface CommandOutput {
  id: string
  stream: "stdout" | "stderr"
  line: string
}

interface CommandExit {
  id: string
  code: number | null
}

interface IngestTargetPickResult {
  mode?: "files" | "folder"
  paths?: string[]
  canceled?: boolean
}

interface VaultOpenResult {
  path?: string
  port?: number
  error?: string
  canceled?: boolean
}

interface SwarmVaultAPI {
  // Vault
  openVault(directPath?: string): Promise<VaultOpenResult>
  initVault(dirPath: string): Promise<{ path?: string; id?: string; canceled?: boolean }>
  getCurrentVault(): Promise<string | null>
  closeVault(): Promise<void>

  // CLI
  runCommand(command: string, args?: string[]): Promise<{ id: string }>
  killCommand(id: string): Promise<boolean>

  // Wiki pages
  listPages(): Promise<{ pages?: string[]; error?: string }>
  readPage(pagePath: string): Promise<{ content?: string; error?: string }>

  // Config
  readConfig(): Promise<{ content?: string; path?: string; error?: string }>
  writeConfig(content: string): Promise<{ ok?: boolean; error?: string }>

  // File picker
  pickIngestTargets(): Promise<IngestTargetPickResult>

  // Graph
  getGraphPort(): Promise<number | null>

  // App state
  getRecentVaults(): Promise<string[]>
  clearRecentVaults(): Promise<void>
  getAppVersion(): Promise<string>

  // Events
  onCommandOutput(callback: (data: CommandOutput) => void): Unsubscribe
  onCommandExit(callback: (data: CommandExit) => void): Unsubscribe
  onMenuEvent(event: string, callback: () => void): Unsubscribe
}

interface Window {
  swarmvault: SwarmVaultAPI
}
