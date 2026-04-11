import { useState } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface ReviewPanelProps {
  cli: ReturnType<typeof useCliRunner>
}

export function ReviewPanel({ cli }: ReviewPanelProps) {
  const [reviewId, setReviewId] = useState("")
  const [candidateId, setCandidateId] = useState("")

  async function handleReviewList() {
    await cli.run("review", ["list"])
  }

  async function handleReviewShow() {
    if (!reviewId.trim()) return
    await cli.run("review", ["show", reviewId.trim()])
  }

  async function handleReviewAccept() {
    if (!reviewId.trim()) return
    await cli.run("review", ["accept", reviewId.trim()])
    await cli.run("review", ["list"])
  }

  async function handleReviewReject() {
    if (!reviewId.trim()) return
    await cli.run("review", ["reject", reviewId.trim()])
    await cli.run("review", ["list"])
  }

  async function handleCandidateList() {
    await cli.run("candidate", ["list"])
  }

  async function handleCandidatePromote() {
    if (!candidateId.trim()) return
    await cli.run("candidate", ["promote", candidateId.trim()])
    await cli.run("candidate", ["list"])
  }

  async function handleCompile() {
    await cli.run("compile")
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
              onClick={handleReviewList}
              disabled={cli.isRunning}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
            >
              List Reviews
            </button>
            <button
              onClick={handleCandidateList}
              disabled={cli.isRunning}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
            >
              List Candidates
            </button>
            <button
              onClick={handleCompile}
              disabled={cli.isRunning}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 border"
              style={{
                background: "transparent",
                color: "var(--color-text-muted)",
                borderColor: "var(--color-border)",
              }}
            >
              {cli.isRunning ? "Running..." : "Compile"}
            </button>
          </div>
        </section>

        {/* Review Actions */}
        <section
          className="flex flex-col gap-3 rounded-lg border p-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <h2 className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-dim)" }}>
            Review Bundle
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={reviewId}
              onChange={(e) => setReviewId(e.target.value)}
              placeholder="Bundle ID"
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
                if (e.key === "Enter") handleReviewShow()
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleReviewShow}
              disabled={!reviewId.trim() || cli.isRunning}
              className="px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer disabled:opacity-50"
              style={{
                background: "transparent",
                color: "var(--color-text-muted)",
                borderColor: "var(--color-border)",
              }}
            >
              Show
            </button>
            <button
              onClick={handleReviewAccept}
              disabled={!reviewId.trim() || cli.isRunning}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
            >
              Accept
            </button>
            <button
              onClick={handleReviewReject}
              disabled={!reviewId.trim() || cli.isRunning}
              className="px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer disabled:opacity-50"
              style={{
                background: "transparent",
                color: "var(--color-danger)",
                borderColor: "var(--color-danger)",
              }}
            >
              Reject
            </button>
          </div>
        </section>

        {/* Candidate Actions */}
        <section
          className="flex flex-col gap-3 rounded-lg border p-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <h2 className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-dim)" }}>
            Candidate
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              placeholder="Candidate ID"
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
                if (e.key === "Enter") handleCandidatePromote()
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCandidatePromote}
              disabled={!candidateId.trim() || cli.isRunning}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
            >
              Promote
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
