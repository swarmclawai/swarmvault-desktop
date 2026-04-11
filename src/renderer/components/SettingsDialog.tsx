import { useState, useEffect } from "react"
import { useVault } from "../hooks/useVault"

interface SettingsDialogProps {
  onClose: () => void
}

interface VaultConfig {
  [key: string]: unknown
}

export function SettingsDialog({ onClose }: SettingsDialogProps) {
  const { vaultPath } = useVault()
  const [config, setConfig] = useState<VaultConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadConfig() {
      if (!vaultPath) {
        setLoading(false)
        return
      }
      try {
        // Read config by running the CLI
        const { id } = await window.swarmvault.runCommand("config", ["--json"])
        // Collect output to parse config
        const lines: string[] = []
        const unsubOutput = window.swarmvault.onCommandOutput((data) => {
          if (data.id === id && data.stream === "stdout") {
            lines.push(data.line)
          }
        })
        const unsubExit = window.swarmvault.onCommandExit((data) => {
          if (data.id === id) {
            unsubOutput()
            unsubExit()
            try {
              const joined = lines.join("\n")
              if (joined.trim()) {
                setConfig(JSON.parse(joined))
              } else {
                setConfig({})
              }
            } catch {
              setConfig({})
            }
            setLoading(false)
          }
        })
      } catch (err) {
        setError("Failed to load configuration")
        setLoading(false)
      }
    }
    loadConfig()
  }, [vaultPath])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-lg rounded-xl border flex flex-col max-h-[80vh]"
        style={{ background: "var(--color-raised)", borderColor: "var(--color-border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h2 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="transition-colors cursor-pointer"
            style={{ color: "var(--color-text-dim)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
              />
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Loading configuration...
              </span>
            </div>
          )}

          {error && (
            <p className="text-xs" style={{ color: "var(--color-danger)" }}>
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-4">
              {/* Vault path */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                  Vault Path
                </label>
                <div
                  className="text-xs px-3 py-2 rounded"
                  style={{ background: "var(--color-surface)", color: "var(--color-text)" }}
                >
                  {vaultPath ?? "None"}
                </div>
              </div>

              {/* Config entries */}
              {config && Object.keys(config).length > 0 ? (
                Object.entries(config).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                      {key}
                    </label>
                    <div
                      className="text-xs px-3 py-2 rounded whitespace-pre-wrap break-all"
                      style={{ background: "var(--color-surface)", color: "var(--color-text)" }}
                    >
                      {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                    </div>
                  </div>
                ))
              ) : (
                !loading && (
                  <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                    No configuration found. Create a swarmvault.config.json in your vault root.
                  </p>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex justify-end px-5 py-3 border-t shrink-0"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer border"
            style={{
              background: "transparent",
              color: "var(--color-text-muted)",
              borderColor: "var(--color-border)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
