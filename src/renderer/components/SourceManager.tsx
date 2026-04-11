import { useState } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface SourceManagerProps {
  cli: ReturnType<typeof useCliRunner>
}

interface Source {
  name: string
  type: string
  lastSync: string | null
}

export function SourceManager({ cli }: SourceManagerProps) {
  const [sources, setSources] = useState<Source[]>([])
  const [adding, setAdding] = useState(false)

  async function handleAddSource() {
    setAdding(true)
    await cli.run("ingest")
    setAdding(false)
  }

  async function handleDelete(name: string) {
    setSources((prev) => prev.filter((s) => s.name !== name))
    cli.pushSystem(`Removed source: ${name}`)
  }

  async function handleRefresh() {
    await cli.run("ingest", ["--status"])
  }

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
            Sources
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer"
              style={{
                background: "transparent",
                color: "var(--color-text-muted)",
                borderColor: "var(--color-border)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              Refresh
            </button>
            <button
              onClick={handleAddSource}
              disabled={adding}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
            >
              {adding ? "Adding..." : "Add Source"}
            </button>
          </div>
        </div>

        {/* Source list */}
        {sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--color-text-dim)" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              No sources added yet
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
              Add files and directories to your vault by running ingest
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sources.map((source) => (
              <div
                key={source.name}
                className="flex items-center justify-between rounded-lg border p-3"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-medium truncate" style={{ color: "var(--color-text)" }}>
                    {source.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}
                    >
                      {source.type}
                    </span>
                    {source.lastSync && (
                      <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                        Last sync: {source.lastSync}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(source.name)}
                  className="px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                  style={{ color: "var(--color-text-dim)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-danger)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
