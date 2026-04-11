import { useState, useEffect } from "react"
import { VaultProvider, useVault } from "./hooks/useVault"
import { useCliRunner } from "./hooks/useCliRunner"
import { VaultPicker } from "./components/VaultPicker"
import { Sidebar } from "./components/Sidebar"
import { MainArea } from "./components/MainArea"
import { TerminalPanel } from "./components/TerminalPanel"
import { StatusBar } from "./components/StatusBar"
import { SettingsDialog } from "./components/SettingsDialog"

export type ActiveTab = "graph" | "pages" | "query" | "review" | "sources"

function AppShell() {
  const { vaultPath, closeVault, openVault } = useVault()
  const cli = useCliRunner()
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>("graph")
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const unsubs = [
      window.swarmvault.onMenuEvent("menu:toggle-sidebar", () =>
        setSidebarVisible((v) => !v),
      ),
      window.swarmvault.onMenuEvent("menu:toggle-terminal", () =>
        setTerminalVisible((v) => !v),
      ),
      window.swarmvault.onMenuEvent("menu:open-vault", () => {
        openVault()
      }),
      window.swarmvault.onMenuEvent("menu:close-vault", () => {
        closeVault()
      }),
    ]
    return () => unsubs.forEach((u) => u())
  }, [closeVault, openVault])

  if (!vaultPath) {
    return <VaultPicker />
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ background: "var(--color-bg)" }}>
      {/* Drag region for macOS traffic lights */}
      <div
        className="w-full shrink-0"
        style={{ height: 36, WebkitAppRegion: "drag" } as React.CSSProperties}
      />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {sidebarVisible && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cli={cli}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        )}
        <MainArea activeTab={activeTab} setActiveTab={setActiveTab} cli={cli} />
      </div>

      {/* Terminal */}
      <TerminalPanel
        visible={terminalVisible}
        onToggle={() => setTerminalVisible((v) => !v)}
        cli={cli}
      />

      {/* Status bar */}
      <StatusBar />

      {/* Settings */}
      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}

export function App() {
  return (
    <VaultProvider>
      <AppShell />
    </VaultProvider>
  )
}
