import { useState } from "react"
import { useVault } from "../hooks/useVault"
import type { ActiveTab } from "../App"
import type { useCliRunner } from "../hooks/useCliRunner"

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
