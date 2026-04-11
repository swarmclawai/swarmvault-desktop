import { useState } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface SourceManagerProps {
  cli: ReturnType<typeof useCliRunner>
}

export function SourceManager({ cli }: SourceManagerProps) {
  const [sourceInput, setSourceInput] = useState("")
  const [deleteId, setDeleteId] = useState("")

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-xl mx-auto p-6 flex flex-col gap-5">

        {/* Quick actions */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-dim)" }}>Quick Actions</div>
          <div className="flex gap-2 flex-wrap">
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => cli.run("source", ["list"])} disabled={cli.isRunning}>
              List Sources
            </button>
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => cli.run("source", ["reload"])} disabled={cli.isRunning}>
              Reload
            </button>
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => cli.run("source", ["guide"])} disabled={cli.isRunning}>
              Guide
            </button>
          </div>
        </div>

        {/* Add source */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-dim)" }}>Add Source</div>
          <input
            type="text"
            className="input-field"
            placeholder="URL, file path, or directory..."
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && sourceInput.trim()) {
                cli.run("source", ["add", sourceInput.trim()])
                setSourceInput("")
              }
            }}
          />
          <button
            className="btn-primary glow-btn cursor-pointer disabled:opacity-40"
            style={{ padding: "7px 16px", fontSize: 11, alignSelf: "flex-start" }}
            onClick={() => {
              if (sourceInput.trim()) {
                cli.run("source", ["add", sourceInput.trim()])
                setSourceInput("")
              }
            }}
            disabled={cli.isRunning || !sourceInput.trim()}
          >
            Add
          </button>
        </div>

        {/* Delete source */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-dim)" }}>Delete Source</div>
          <input
            type="text"
            className="input-field"
            placeholder="Source ID to remove..."
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && deleteId.trim()) {
                cli.run("source", ["delete", deleteId.trim()])
                setDeleteId("")
              }
            }}
          />
          <button
            className="btn-outline cursor-pointer disabled:opacity-40"
            style={{ padding: "7px 16px", fontSize: 11, alignSelf: "flex-start", borderColor: "var(--color-danger)", color: "var(--color-danger)" }}
            onClick={() => {
              if (deleteId.trim()) {
                cli.run("source", ["delete", deleteId.trim()])
                setDeleteId("")
              }
            }}
            disabled={cli.isRunning || !deleteId.trim()}
          >
            Delete
          </button>
        </div>

        <p className="text-[10px] text-center" style={{ color: "var(--color-text-dim)" }}>
          Output appears in the terminal panel below
        </p>
      </div>
    </div>
  )
}
