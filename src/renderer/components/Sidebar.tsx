import { useState, useEffect } from "react"
import { useVault } from "../hooks/useVault"
import type { ActiveTab } from "../App"
import type { useCliRunner } from "../hooks/useCliRunner"

/* ── Icons (16x16, stroke-based, strokeWidth 1.5) ── */

function IconFolder() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H8L6.5 3H3a1 1 0 0 0-1 1Z" />
    </svg>
  )
}

function IconFile() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5L9 1Z" />
      <path d="M9 1v4h4" />
    </svg>
  )
}

function IconBuild() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8.5V4L8 1 2 4v5l6 3 2.5-1.25" />
      <path d="M11.5 11.5l2.5 2.5M12.5 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M14 14l-3.5-3.5" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v8M4.5 7.5 8 11l3.5-3.5M3 13h10" />
    </svg>
  )
}

function IconCompass() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M10.5 5.5l-1.2 3.8-3.8 1.2 1.2-3.8z" />
    </svg>
  )
}

function IconInbox() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9h3.5l1.5 2h2l1.5-2H14" />
      <path d="M3 3h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

function IconGauge() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12Z" />
      <path d="M8 5v3l2 1" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l1.8 3.6L14 6.2l-3 2.9.7 4.1L8 11.3 4.3 13.2l.7-4.1-3-2.9 4.2-.6L8 2Z" />
    </svg>
  )
}

function IconBlast() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <circle cx="8" cy="8" r="5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
    </svg>
  )
}

function IconExplainGraph() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M6.5 6a1.5 1.5 0 0 1 3 0c0 1-1.5 1.5-1.5 2.5" />
      <circle cx="8" cy="12" r="0.5" fill="currentColor" />
    </svg>
  )
}

function IconPath() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="3" cy="13" r="1.5" />
      <circle cx="13" cy="3" r="1.5" />
      <path d="M4.5 11.5C6 10 10 6 11.5 4.5" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M13.5 8a5.5 5.5 0 0 0-.1-.9l1.3-1-.7-1.3-1.5.5A5.3 5.3 0 0 0 11 4l.5-1.5L10.2 2l-1 1.3a5.5 5.5 0 0 0-1.8 0L6.4 2l-1.3.5L5.6 4a5.3 5.3 0 0 0-1.2 1.3l-1.5-.5-.8 1.3L3.4 7a5.5 5.5 0 0 0 0 1.8l-1.3 1 .7 1.3 1.5-.5c.3.5.7.9 1.2 1.2l-.5 1.5 1.3.7 1-1.3c.6.1 1.2.1 1.8 0l1 1.3 1.3-.7-.5-1.5c.5-.3.9-.7 1.2-1.2l1.5.5.8-1.3L13.4 9a5.5 5.5 0 0 0 .1-.9Z" />
    </svg>
  )
}

/* ── Component ── */

interface SidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  cli: ReturnType<typeof useCliRunner>
  onOpenSettings: () => void
}

export function Sidebar({ activeTab, setActiveTab, cli, onOpenSettings }: SidebarProps) {
  const { vaultPath, openVault, initVault } = useVault()
  const [watchRunning, setWatchRunning] = useState(false)

  // Reset watchRunning when process exits
  useEffect(() => {
    if (!cli.isRunning && watchRunning) setWatchRunning(false)
  }, [cli.isRunning, watchRunning])

  /* Advanced / Graph input state */
  const [blastOpen, setBlastOpen] = useState(false)
  const [blastNode, setBlastNode] = useState("")
  const [explainOpen, setExplainOpen] = useState(false)
  const [explainTarget, setExplainTarget] = useState("")
  const [pathOpen, setPathOpen] = useState(false)
  const [pathFrom, setPathFrom] = useState("")
  const [pathTo, setPathTo] = useState("")

  const vaultName = vaultPath ? vaultPath.split("/").pop() ?? "vault" : "No Vault"
  const truncatedPath = vaultPath
    ? vaultPath.length > 28
      ? "..." + vaultPath.slice(-25)
      : vaultPath
    : ""

  /* ── Handlers ── */

  async function handleIngest() {
    const result = await window.swarmvault.pickFile()
    if (result.canceled || !result.paths?.length) return
    for (const p of result.paths) {
      await cli.run("ingest", [p])
    }
  }

  async function handleCompile() {
    await cli.run("compile")
  }

  async function handleLint() {
    await cli.run("lint")
  }

  async function handleWatch() {
    if (watchRunning) {
      cli.kill()
      setWatchRunning(false)
    } else {
      await cli.run("watch")
      setWatchRunning(true)
    }
  }

  async function handleExport() {
    await cli.run("graph", ["export", "--format", "html"])
  }

  async function handleInboxImport() {
    await cli.run("inbox", ["import"])
  }

  async function handleBenchmark() {
    await cli.run("benchmark", [])
  }

  async function handleGodNodes() {
    await cli.run("graph", ["god-nodes"])
  }

  async function handleBlast() {
    if (!blastNode.trim()) return
    await cli.run("graph", ["blast", blastNode.trim()])
  }

  async function handleExplain() {
    if (!explainTarget.trim()) return
    await cli.run("graph", ["explain", explainTarget.trim()])
  }

  async function handleFindPath() {
    if (!pathFrom.trim() || !pathTo.trim()) return
    await cli.run("graph", ["path", "--from", pathFrom.trim(), "--to", pathTo.trim()])
  }

  return (
    <aside className="sidebar flex flex-col h-full shrink-0">
      {/* Vault identity */}
      <div className="sidebar-header">
        <div className="sidebar-vault-name">
          <IconFolder />
          <span className="truncate">{vaultName}</span>
        </div>
        {truncatedPath && (
          <div className="sidebar-vault-path" title={vaultPath ?? undefined}>
            {truncatedPath}
          </div>
        )}
      </div>

      {/* Scrollable action area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Actions */}
        <div className="section-label">Actions</div>
        <div className="sidebar-section">
          <button className="action-btn" onClick={handleIngest}>
            <IconFile /> Ingest
          </button>
          <button className="action-btn" onClick={handleCompile}>
            <IconBuild /> Compile
          </button>
          <button className="action-btn" onClick={() => setActiveTab("query")}>
            <IconSearch /> Query
          </button>
          <button className="action-btn" onClick={handleLint}>
            <IconCheck /> Lint
          </button>
          <button className="action-btn" onClick={handleWatch}>
            <IconEye /> {watchRunning ? "Stop Watch" : "Watch"}
          </button>
          <button className="action-btn" onClick={handleExport}>
            <IconDownload /> Export
          </button>
          <button className="action-btn" onClick={() => setActiveTab("query")}>
            <IconCompass /> Explore
          </button>
        </div>

        {/* Graph */}
        <div className="section-label">Graph</div>
        <div className="sidebar-section">
          <button className="action-btn" onClick={handleGodNodes}>
            <IconStar /> God Nodes
          </button>

          {/* Blast Radius */}
          <button className="action-btn" onClick={() => setBlastOpen(!blastOpen)}>
            <IconBlast /> Blast Radius
          </button>
          {blastOpen && (
            <div className="sidebar-inline-form">
              <input
                type="text"
                placeholder="node name"
                value={blastNode}
                onChange={(e) => setBlastNode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBlast()}
                className="input-field sidebar-inline-input"
              />
              <button onClick={handleBlast} className="sidebar-run-btn">
                Run
              </button>
            </div>
          )}

          {/* Explain */}
          <button className="action-btn" onClick={() => setExplainOpen(!explainOpen)}>
            <IconExplainGraph /> Explain
          </button>
          {explainOpen && (
            <div className="sidebar-inline-form">
              <input
                type="text"
                placeholder="target"
                value={explainTarget}
                onChange={(e) => setExplainTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExplain()}
                className="input-field sidebar-inline-input"
              />
              <button onClick={handleExplain} className="sidebar-run-btn">
                Run
              </button>
            </div>
          )}

          {/* Find Path */}
          <button className="action-btn" onClick={() => setPathOpen(!pathOpen)}>
            <IconPath /> Find Path
          </button>
          {pathOpen && (
            <div className="sidebar-inline-form sidebar-inline-form--stacked">
              <div className="sidebar-inline-row">
                <input
                  type="text"
                  placeholder="from"
                  value={pathFrom}
                  onChange={(e) => setPathFrom(e.target.value)}
                  className="input-field sidebar-inline-input"
                />
                <input
                  type="text"
                  placeholder="to"
                  value={pathTo}
                  onChange={(e) => setPathTo(e.target.value)}
                  className="input-field sidebar-inline-input"
                />
              </div>
              <button onClick={handleFindPath} className="sidebar-run-btn">
                Run
              </button>
            </div>
          )}
        </div>

        {/* Advanced */}
        <div className="section-label">Advanced</div>
        <div className="sidebar-section">
          <button className="action-btn" onClick={handleInboxImport}>
            <IconInbox /> Inbox Import
          </button>
          <button className="action-btn" onClick={handleBenchmark}>
            <IconGauge /> Benchmark
          </button>
        </div>
      </div>

      {/* Bottom: vault controls */}
      <div className="sidebar-footer">
        <button className="action-btn" onClick={() => openVault()}>
          <IconFolder /> Open Vault
        </button>
        <button className="action-btn" onClick={() => initVault()}>
          <IconPlus /> New Vault
        </button>
        <button className="action-btn" onClick={onOpenSettings}>
          <IconGear /> Settings
        </button>
      </div>
    </aside>
  )
}
