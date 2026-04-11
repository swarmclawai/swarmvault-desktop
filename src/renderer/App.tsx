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

const IS_MAC =
  typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent)

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
    <div className="app-shell">
      {/* Subtle grid background texture */}
      <div className="grid-pattern" />

      {/* macOS drag region for traffic lights */}
      {IS_MAC && (
        <div
          className="app-drag-region"
          style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
        />
      )}

      {/* Main content: sidebar + main area */}
      <div className={`app-body${sidebarVisible ? "" : " sidebar-hidden"}`}>
        <div className={`app-sidebar-slot${sidebarVisible ? "" : " collapsed"}`}>
          {sidebarVisible && (
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              cli={cli}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}
        </div>
        <MainArea activeTab={activeTab} setActiveTab={setActiveTab} cli={cli} />
      </div>

      {/* Terminal + StatusBar stack at bottom */}
      <div className="app-bottom">
        <TerminalPanel
          visible={terminalVisible}
          onToggle={() => setTerminalVisible((v) => !v)}
          cli={cli}
        />
        <StatusBar />
      </div>

      {/* Settings dialog */}
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
