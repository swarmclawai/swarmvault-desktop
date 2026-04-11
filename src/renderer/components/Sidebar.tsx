import { useState } from "react"
import { useVault } from "../hooks/useVault"
import type { ActiveTab } from "../App"
import type { useCliRunner } from "../hooks/useCliRunner"

/* ── Advanced section icons ── */

function IconInbox() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9h3.5l1.5 2h2l1.5-2H14" />
      <path d="M3 3h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

function IconGauge() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12Z" />
      <path d="M8 5v3l2 1" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l1.8 3.6L14 6.2l-3 2.9.7 4.1L8 11.3 4.3 13.2l.7-4.1-3-2.9 4.2-.6L8 2Z" />
    </svg>
  )
}

function IconBlast() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <circle cx="8" cy="8" r="5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
    </svg>
  )
}

function IconExplainGraph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M6.5 6a1.5 1.5 0 0 1 3 0c0 1-1.5 1.5-1.5 2.5" />
      <circle cx="8" cy="12" r="0.5" fill="currentColor" />
    </svg>
  )
}

function IconPath() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="3" cy="13" r="1.5" />
      <circle cx="13" cy="3" r="1.5" />
      <path d="M4.5 11.5C6 10 10 6 11.5 4.5" />
    </svg>
  )
}

interface SidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  cli: ReturnType<typeof useCliRunner>
  onOpenSettings: () => void
}

function IconFile() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5L9 1Z" />
      <path d="M9 1v4h4" />
    </svg>
  )
}

function IconBuild() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8.5V4L8 1 2 4v5l6 3 2.5-1.25" />
      <path d="M11.5 11.5l2.5 2.5M12.5 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M14 14l-3.5-3.5" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v8M4.5 7.5 8 11l3.5-3.5M3 13h10" />
    </svg>
  )
}

function IconCompass() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M10.5 5.5l-1.2 3.8-3.8 1.2 1.2-3.8z" />
    </svg>
  )
}

function IconFolder() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H8L6.5 3H3a1 1 0 0 0-1 1Z" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M13.5 8a5.5 5.5 0 0 0-.1-.9l1.3-1-.7-1.3-1.5.5A5.3 5.3 0 0 0 11 4l.5-1.5L10.2 2l-1 1.3a5.5 5.5 0 0 0-1.8 0L6.4 2l-1.3.5L5.6 4a5.3 5.3 0 0 0-1.2 1.3l-1.5-.5-.8 1.3L3.4 7a5.5 5.5 0 0 0 0 1.8l-1.3 1 .7 1.3 1.5-.5c.3.5.7.9 1.2 1.2l-.5 1.5 1.3.7 1-1.3c.6.1 1.2.1 1.8 0l1 1.3 1.3-.7-.5-1.5c.5-.3.9-.7 1.2-1.2l1.5.5.8-1.3L13.4 9a5.5 5.5 0 0 0 .1-.9Z" />
    </svg>
  )
}

const btnClass =
  "flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded border transition-colors duration-150 text-left cursor-pointer"
const btnNormal =
  "bg-[#151515] border-[#333] text-[#888] hover:bg-[#1a1a1a] hover:text-[#00FF88]"

export function Sidebar({ activeTab, setActiveTab, cli, onOpenSettings }: SidebarProps) {
  const { vaultPath, openVault, initVault } = useVault()
  const [watchRunning, setWatchRunning] = useState(false)

  /* Advanced / Graph input state */
  const [blastOpen, setBlastOpen] = useState(false)
  const [blastNode, setBlastNode] = useState("")
  const [explainOpen, setExplainOpen] = useState(false)
  const [explainTarget, setExplainTarget] = useState("")
  const [pathOpen, setPathOpen] = useState(false)
  const [pathFrom, setPathFrom] = useState("")
  const [pathTo, setPathTo] = useState("")

  const vaultName = vaultPath ? vaultPath.split("/").pop() ?? "vault" : "No Vault"

  async function handleIngest() {
    await cli.run("ingest")
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
    await cli.run("graph", ["export"])
  }

  /* ── Advanced handlers ── */

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
    <div
      className="flex flex-col h-full shrink-0 border-r"
      style={{ width: 240, background: "var(--color-raised)", borderColor: "var(--color-border)" }}
    >
      {/* Vault name */}
      <div className="px-3 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="text-xs font-semibold truncate" style={{ color: "var(--color-accent)" }}>
          {vaultName}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        <button className={`${btnClass} ${btnNormal}`} onClick={handleIngest}>
          <IconFile /> Ingest
        </button>
        <button className={`${btnClass} ${btnNormal}`} onClick={handleCompile}>
          <IconBuild /> Compile
        </button>
        <button
          className={`${btnClass} ${activeTab === "query" ? "bg-[#1a1a1a] border-[#00FF88] text-[#00FF88]" : btnNormal}`}
          onClick={() => setActiveTab("query")}
        >
          <IconSearch /> Query
        </button>
        <button className={`${btnClass} ${btnNormal}`} onClick={handleLint}>
          <IconCheck /> Lint
        </button>
        <button
          className={`${btnClass} ${watchRunning ? "bg-[#1a1a1a] border-[#00FF88] text-[#00FF88]" : btnNormal}`}
          onClick={handleWatch}
        >
          <IconEye /> {watchRunning ? "Stop Watch" : "Watch"}
        </button>
        <button className={`${btnClass} ${btnNormal}`} onClick={handleExport}>
          <IconDownload /> Export
        </button>
        <button
          className={`${btnClass} ${activeTab === "query" ? "bg-[#1a1a1a] border-[#00FF88] text-[#00FF88]" : btnNormal}`}
          onClick={() => setActiveTab("query")}
        >
          <IconCompass /> Explore
        </button>

        {/* ── Divider ── */}
        <div className="my-2 border-t" style={{ borderColor: "var(--color-border)" }} />

        {/* ── Advanced ── */}
        <div className="text-[10px] uppercase tracking-wider px-1 pb-1" style={{ color: "#555" }}>
          Advanced
        </div>
        <button className={`${btnClass} ${btnNormal}`} onClick={handleInboxImport}>
          <IconInbox /> Inbox Import
        </button>
        <button className={`${btnClass} ${btnNormal}`} onClick={handleBenchmark}>
          <IconGauge /> Benchmark
        </button>

        {/* ── Divider ── */}
        <div className="my-2 border-t" style={{ borderColor: "var(--color-border)" }} />

        {/* ── Graph ── */}
        <div className="text-[10px] uppercase tracking-wider px-1 pb-1" style={{ color: "#555" }}>
          Graph
        </div>
        <button className={`${btnClass} ${btnNormal}`} onClick={handleGodNodes}>
          <IconStar /> God Nodes
        </button>

        {/* Blast Radius */}
        <button className={`${btnClass} ${btnNormal}`} onClick={() => setBlastOpen(!blastOpen)}>
          <IconBlast /> Blast Radius
        </button>
        {blastOpen && (
          <div className="flex gap-1 px-1">
            <input
              type="text"
              placeholder="node name"
              value={blastNode}
              onChange={(e) => setBlastNode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBlast()}
              className="flex-1 min-w-0 px-2 py-1 text-xs rounded border bg-[#111] border-[#333] text-[#ccc] outline-none focus:border-[#00FF88]"
            />
            <button
              onClick={handleBlast}
              className="px-2 py-1 text-xs rounded border bg-[#151515] border-[#333] text-[#00FF88] hover:bg-[#1a1a1a] cursor-pointer"
            >
              Run
            </button>
          </div>
        )}

        {/* Explain */}
        <button className={`${btnClass} ${btnNormal}`} onClick={() => setExplainOpen(!explainOpen)}>
          <IconExplainGraph /> Explain
        </button>
        {explainOpen && (
          <div className="flex gap-1 px-1">
            <input
              type="text"
              placeholder="target"
              value={explainTarget}
              onChange={(e) => setExplainTarget(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExplain()}
              className="flex-1 min-w-0 px-2 py-1 text-xs rounded border bg-[#111] border-[#333] text-[#ccc] outline-none focus:border-[#00FF88]"
            />
            <button
              onClick={handleExplain}
              className="px-2 py-1 text-xs rounded border bg-[#151515] border-[#333] text-[#00FF88] hover:bg-[#1a1a1a] cursor-pointer"
            >
              Run
            </button>
          </div>
        )}

        {/* Find Path */}
        <button className={`${btnClass} ${btnNormal}`} onClick={() => setPathOpen(!pathOpen)}>
          <IconPath /> Find Path
        </button>
        {pathOpen && (
          <div className="flex flex-col gap-1 px-1">
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="from"
                value={pathFrom}
                onChange={(e) => setPathFrom(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1 text-xs rounded border bg-[#111] border-[#333] text-[#ccc] outline-none focus:border-[#00FF88]"
              />
              <input
                type="text"
                placeholder="to"
                value={pathTo}
                onChange={(e) => setPathTo(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1 text-xs rounded border bg-[#111] border-[#333] text-[#ccc] outline-none focus:border-[#00FF88]"
              />
            </div>
            <button
              onClick={handleFindPath}
              className="px-2 py-1 text-xs rounded border bg-[#151515] border-[#333] text-[#00FF88] hover:bg-[#1a1a1a] cursor-pointer"
            >
              Run
            </button>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-2 border-t flex flex-col gap-1" style={{ borderColor: "var(--color-border)" }}>
        <button className={`${btnClass} ${btnNormal}`} onClick={() => openVault()}>
          <IconFolder /> Open Vault
        </button>
        <button className={`${btnClass} ${btnNormal}`} onClick={() => initVault()}>
          <IconPlus /> New Vault
        </button>
        <button className={`${btnClass} ${btnNormal}`} onClick={onOpenSettings}>
          <IconGear /> Settings
        </button>
      </div>
    </div>
  )
}
