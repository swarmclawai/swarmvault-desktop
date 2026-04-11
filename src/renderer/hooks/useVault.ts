import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createElement } from "react"

interface VaultState {
  vaultPath: string | null
  graphPort: number | null
  recentVaults: string[]
  openVault: () => Promise<void>
  closeVault: () => Promise<void>
  initVault: () => Promise<void>
  refreshRecent: () => Promise<void>
}

const VaultContext = createContext<VaultState | null>(null)

export function VaultProvider({ children }: { children: ReactNode }) {
  const [vaultPath, setVaultPath] = useState<string | null>(null)
  const [graphPort, setGraphPort] = useState<number | null>(null)
  const [recentVaults, setRecentVaults] = useState<string[]>([])

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

  const openVault = useCallback(async () => {
    const result = await window.swarmvault.openVault()
    if (result.error) {
      console.error("Failed to open vault:", result.error)
      return
    }
    if (result.path) {
      setVaultPath(result.path)
      setGraphPort(result.port ?? null)
      await refreshRecent()
    }
  }, [refreshRecent])

  const closeVault = useCallback(async () => {
    await window.swarmvault.closeVault()
    setVaultPath(null)
    setGraphPort(null)
  }, [])

  const initVault = useCallback(async () => {
    const result = await window.swarmvault.openVault()
    if (result.error || !result.path) return
    await window.swarmvault.initVault(result.path)
    setVaultPath(result.path)
    await refreshRecent()
  }, [refreshRecent])

  const value: VaultState = {
    vaultPath,
    graphPort,
    recentVaults,
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
