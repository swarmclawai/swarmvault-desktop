import { useState, useEffect, useCallback, useRef } from "react"
import { useVault } from "../hooks/useVault"

interface SettingsDialogProps {
  onClose: () => void
}

export function SettingsDialog({ onClose }: SettingsDialogProps) {
  const { vaultPath } = useVault()
  const [content, setContent] = useState("")
  const [configPath, setConfigPath] = useState("")
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: "ok" | "error"; message: string } | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    async function load() {
      const result = await window.swarmvault.readConfig()
      if (result.content !== undefined) {
        try {
          setContent(JSON.stringify(JSON.parse(result.content), null, 2))
        } catch {
          setContent(result.content)
        }
      }
      if (result.path) setConfigPath(result.path)
    }
    load()
  }, [])

  const contentRef = useRef(content)
  contentRef.current = content

  const handleSave = useCallback(async () => {
    const c = contentRef.current
    setSaving(true)
    setStatus(null)
    try {
      JSON.parse(c)
      const result = await window.swarmvault.writeConfig(c)
      if (result.error) {
        setStatus({ type: "error", message: result.error })
      } else {
        setStatus({ type: "ok", message: "Saved" })
        setDirty(false)
        setTimeout(() => setStatus(null), 2000)
      }
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Invalid JSON" })
    } finally {
      setSaving(false)
    }
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose, handleSave])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-card-elevated w-full max-w-2xl flex flex-col animate-in" style={{ maxHeight: "80vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 shrink-0" style={{ height: 44, borderBottom: "1px solid var(--color-border)" }}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold" style={{ color: "var(--color-text)" }}>Settings</span>
            {dirty && <span className="text-[10px]" style={{ color: "var(--color-accent)" }}>unsaved</span>}
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <span className="text-[10px]" style={{ color: status.type === "ok" ? "var(--color-accent)" : "var(--color-danger)" }}>
                {status.message}
              </span>
            )}
            <button
              className="btn-primary cursor-pointer disabled:opacity-40"
              style={{ padding: "5px 14px", fontSize: 10 }}
              onClick={handleSave}
              disabled={saving || !dirty}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={onClose} className="cursor-pointer" style={{ color: "var(--color-text-dim)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Vault path */}
        <div className="px-5 py-2 shrink-0" style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-raised)" }}>
          <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>
            {configPath || vaultPath}
          </span>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <textarea
            className="w-full h-full p-5 resize-none outline-none text-xs leading-relaxed"
            style={{
              background: "var(--color-bg)",
              color: "var(--color-text)",
              fontFamily: "var(--font-mono)",
              border: "none",
            }}
            value={content}
            onChange={(e) => { setContent(e.target.value); setDirty(true); setStatus(null) }}
            spellCheck={false}
          />
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2 shrink-0 flex items-center justify-between" style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-raised)" }}>
          <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>
            swarmvault.config.json
          </span>
          <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>
            {"\u2318"}S to save &middot; Esc to close
          </span>
        </div>
      </div>
    </div>
  )
}
