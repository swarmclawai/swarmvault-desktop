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

interface VaultOpenResult {
  path?: string
  port?: number
  error?: string
}

interface SwarmVaultAPI {
  // Vault
  openVault(): Promise<VaultOpenResult>
  initVault(dirPath: string): Promise<void>
  getCurrentVault(): Promise<string | null>
  closeVault(): Promise<void>

  // CLI
  runCommand(command: string, args?: string[]): Promise<{ id: string }>
  killCommand(id: string): Promise<void>

  // Wiki pages
  listPages(): Promise<{ pages?: string[]; error?: string }>
  readPage(pagePath: string): Promise<{ content?: string; error?: string }>

  // Graph
  getGraphPort(): Promise<number | null>

  // App state
  getRecentVaults(): Promise<string[]>
  clearRecentVaults(): Promise<void>

  // Events
  onCommandOutput(callback: (data: CommandOutput) => void): Unsubscribe
  onCommandExit(callback: (data: CommandExit) => void): Unsubscribe
  onMenuEvent(event: string, callback: () => void): Unsubscribe
}

interface Window {
  swarmvault: SwarmVaultAPI
}
