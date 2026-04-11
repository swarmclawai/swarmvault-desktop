import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createElement } from "react"

interface VaultState {
  vaultPath: string | null
  graphPort: number | null
  recentVaults: string[]
  loading: boolean
  openVault: (directPath?: string) => Promise<void>
  closeVault: () => Promise<void>
  initVault: () => Promise<void>
  refreshRecent: () => Promise<void>
}

const VaultContext = createContext<VaultState | null>(null)

export function VaultProvider({ children }: { children: ReactNode }) {
  const [vaultPath, setVaultPath] = useState<string | null>(null)
  const [graphPort, setGraphPort] = useState<number | null>(null)
  const [recentVaults, setRecentVaults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const refreshRecent = useCallback(async () => {
    const vaults = await window.swarmvault.getRecentVaults()
    setRecentVaults(vaults)
  }, [])

  const refreshPort = useCallback(async () => {
    const port = await window.swarmvault.getGraphPort()
    setGraphPort(port)
  }, [])

  useEffect(() => {
    async function init() {
      const current = await window.swarmvault.getCurrentVault()
      setVaultPath(current)
      if (current) {
        await refreshPort()
      }
      await refreshRecent()
    }
    init()
  }, [refreshRecent, refreshPort])

  const openVault = useCallback(async (directPath?: string) => {
    setLoading(true)
    try {
      const result = await window.swarmvault.openVault(directPath)
      if (result.canceled) return
      if (result.error) {
        console.error("Failed to open vault:", result.error)
        return
      }
      if (result.path) {
        setVaultPath(result.path)
        setGraphPort(result.port ?? null)
        await refreshRecent()
      }
    } finally {
      setLoading(false)
    }
  }, [refreshRecent])

  const closeVault = useCallback(async () => {
    await window.swarmvault.closeVault()
    setVaultPath(null)
    setGraphPort(null)
  }, [])

  const initVault = useCallback(async () => {
    // vault:init with empty string triggers its own directory picker
    const initResult = await window.swarmvault.initVault("")
    if (!initResult || initResult.canceled || !initResult.path) return

    // vault:init now awaits process completion, so the config file exists
    await openVault(initResult.path)
  }, [openVault])

  const value: VaultState = {
    vaultPath,
    graphPort,
    recentVaults,
    loading,
    openVault,
    closeVault,
    initVault,
    refreshRecent,
  }

  return createElement(VaultContext.Provider, { value }, children)
}

export function useVault(): VaultState {
  const ctx = useContext(VaultContext)
  if (!ctx) throw new Error("useVault must be used within VaultProvider")
  return ctx
}
