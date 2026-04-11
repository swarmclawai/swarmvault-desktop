import { useState } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface SourceManagerProps {
  cli: ReturnType<typeof useCliRunner>
}

export function SourceManager({ cli }: SourceManagerProps) {
  const [addInput, setAddInput] = useState("")
  const [deleteId, setDeleteId] = useState("")

  async function handleListSources() {
    await cli.run("source", ["list"])
  }

  async function handleAddSource() {
    if (!addInput.trim()) return
    await cli.run("source", ["add", addInput.trim()])
    setAddInput("")
    await cli.run("source", ["list"])
  }

  async function handleReloadSources() {
    await cli.run("source", ["reload"])
  }

  async function handleDeleteSource() {
    if (!deleteId.trim()) return
    await cli.run("source", ["delete", deleteId.trim()])
    setDeleteId("")
    await cli.run("source", ["list"])
  }

  async function handleGuide() {
    await cli.run("source", ["guide"])
  }

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Quick Actions */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-dim)" }}>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleListSources}
              disabled={cli.isRunning}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
            >
              List Sources
            </button>
            <button
              onClick={handleReloadSources}
              disabled={cli.isRunning}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 border"
              style={{
                background: "transparent",
                color: "var(--color-text-muted)",
                borderColor: "var(--color-border)",
              }}
            >
              Reload Sources
            </button>
            <button
              onClick={handleGuide}
              disabled={cli.isRunning}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 border"
              style={{
                background: "transparent",
                color: "var(--color-text-muted)",
                borderColor: "var(--color-border)",
              }}
            >
              Guide
            </button>
          </div>
        </section>

        {/* Add Source */}
        <section
          className="flex flex-col gap-3 rounded-lg border p-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <h2 className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-dim)" }}>
            Add Source
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              placeholder="URL or file path"
              className="flex-1 px-3 py-2 rounded-lg text-xs outline-none transition-colors"
              style={{
                background: "var(--color-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSource()
              }}
            />
            <button
              onClick={handleAddSource}
              disabled={!addInput.trim() || cli.isRunning}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
            >
              Add
            </button>
          </div>
        </section>

        {/* Delete Source */}
        <section
          className="flex flex-col gap-3 rounded-lg border p-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <h2 className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-dim)" }}>
            Delete Source
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="Source ID"
              className="flex-1 px-3 py-2 rounded-lg text-xs outline-none transition-colors"
              style={{
                background: "var(--color-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDeleteSource()
              }}
            />
            <button
              onClick={handleDeleteSource}
              disabled={!deleteId.trim() || cli.isRunning}
              className="px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer disabled:opacity-50"
              style={{
                background: "transparent",
                color: "var(--color-danger)",
                borderColor: "var(--color-danger)",
              }}
            >
              Delete
            </button>
          </div>
        </section>

        {/* Hint */}
        <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
          Output appears in the terminal panel below.
        </p>
      </div>
    </div>
  )
}
