import { useState, useRef, useEffect } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface QueryTabProps {
  cli: ReturnType<typeof useCliRunner>
}

export function QueryTab({ cli }: QueryTabProps) {
  const [queryText, setQueryText] = useState("")
  const [exploreMode, setExploreMode] = useState(false)
  const [queryLines, setQueryLines] = useState<typeof cli.lines>([])
  const resultsRef = useRef<HTMLDivElement>(null)

  // Track output lines for the latest query command
  useEffect(() => {
    setQueryLines(cli.lines)
  }, [cli.lines])

  // Auto-scroll results
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight
    }
  }, [queryLines])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!queryText.trim()) return

    if (exploreMode) {
      await cli.run("explore", [queryText.trim()])
    } else {
      await cli.run("query", [queryText.trim()])
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--color-bg)" }}>
      {/* Query input */}
      <form onSubmit={handleSubmit} className="shrink-0 p-4 flex flex-col gap-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--color-text-muted)" }}>
            <input
              type="checkbox"
              checked={exploreMode}
              onChange={(e) => setExploreMode(e.target.checked)}
              className="accent-green-400"
            />
            Explore mode
          </label>
        </div>
        <div className="flex gap-2">
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e)
              }
            }}
            placeholder={exploreMode ? "Enter a topic to explore..." : "Enter your query..."}
            rows={3}
            className="flex-1 px-3 py-2 rounded-lg text-xs resize-none outline-none transition-colors"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
          />
          <button
            type="submit"
            disabled={!queryText.trim() || cli.isRunning}
            className="px-4 py-2 rounded-lg text-xs font-medium self-end transition-colors cursor-pointer disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
          >
            {cli.isRunning ? "Running..." : "Run Query"}
          </button>
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
          {exploreMode ? "Explore topics with interactive navigation" : "Press Cmd+Enter to run"}
        </p>
      </form>

      {/* Results */}
      <div ref={resultsRef} className="flex-1 overflow-y-auto p-4">
        {queryLines.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
              Run a query to see results
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {queryLines.map((line, i) => (
              <div
                key={`${line.timestamp}-${i}`}
                className="text-xs leading-relaxed"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color:
                    line.stream === "stderr"
                      ? "var(--color-danger)"
                      : line.stream === "system"
                        ? "var(--color-accent)"
                        : "var(--color-text)",
                }}
              >
                {line.line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
