import { useState } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface ReviewPanelProps {
  cli: ReturnType<typeof useCliRunner>
}

export function ReviewPanel({ cli }: ReviewPanelProps) {
  const [bundleId, setBundleId] = useState("")
  const [candidateId, setCandidateId] = useState("")

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-xl mx-auto p-6 flex flex-col gap-5">

        {/* Quick actions */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-dim)" }}>Quick Actions</div>
          <div className="flex gap-2 flex-wrap">
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => cli.run("review", ["list"])} disabled={cli.isRunning}>
              List Reviews
            </button>
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => cli.run("candidate", ["list"])} disabled={cli.isRunning}>
              List Candidates
            </button>
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => cli.run("compile")} disabled={cli.isRunning}>
              Compile
            </button>
          </div>
        </div>

        {/* Review bundle */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-dim)" }}>Review Bundle</div>
          <input
            type="text"
            className="input-field"
            placeholder="Enter bundle ID..."
            value={bundleId}
            onChange={(e) => setBundleId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && bundleId.trim() && cli.run("review", ["show", bundleId.trim()])}
          />
          <div className="flex gap-2">
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => bundleId.trim() && cli.run("review", ["show", bundleId.trim()])} disabled={cli.isRunning || !bundleId.trim()}>
              Show
            </button>
            <button className="btn-primary glow-btn cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => bundleId.trim() && cli.run("review", ["accept", bundleId.trim()])} disabled={cli.isRunning || !bundleId.trim()}>
              Accept
            </button>
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11, borderColor: "var(--color-danger)", color: "var(--color-danger)" }} onClick={() => bundleId.trim() && cli.run("review", ["reject", bundleId.trim()])} disabled={cli.isRunning || !bundleId.trim()}>
              Reject
            </button>
          </div>
        </div>

        {/* Candidates */}
        <div className="glass-card p-5 flex flex-col gap-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-dim)" }}>Candidate</div>
          <input
            type="text"
            className="input-field"
            placeholder="Enter candidate ID..."
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && candidateId.trim() && cli.run("candidate", ["promote", candidateId.trim()])}
          />
          <div className="flex gap-2">
            <button className="btn-primary glow-btn cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => candidateId.trim() && cli.run("candidate", ["promote", candidateId.trim()])} disabled={cli.isRunning || !candidateId.trim()}>
              Promote
            </button>
            <button className="btn-outline cursor-pointer disabled:opacity-40" style={{ padding: "7px 16px", fontSize: 11 }} onClick={() => candidateId.trim() && cli.run("candidate", ["archive", candidateId.trim()])} disabled={cli.isRunning || !candidateId.trim()}>
              Archive
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center" style={{ color: "var(--color-text-dim)" }}>
          Output appears in the terminal panel below
        </p>
      </div>
    </div>
  )
}
