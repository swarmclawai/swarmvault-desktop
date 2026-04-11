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

  const [queryCommandId, setQueryCommandId] = useState<string | null>(null)

  // Filter lines to only those from the current query command
  useEffect(() => {
    if (!queryCommandId) return
    const filtered = cli.lines.filter(
      (l) => l.id === queryCommandId || l.id === "system"
    )
    setQueryLines(filtered)
  }, [cli.lines, queryCommandId])

  // Auto-scroll results
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight
    }
  }, [queryLines])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!queryText.trim()) return

    setQueryLines([])
    if (exploreMode) {
      await cli.run("explore", [queryText.trim()])
    } else {
      await cli.run("query", [queryText.trim()])
    }
    setQueryCommandId(cli.commandId)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--color-bg)" }}>
      {/* Query input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 flex flex-col gap-3"
        style={{
          padding: "16px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Mode toggle */}
        <div className="flex items-center justify-between">
          <span className="section-label" style={{ padding: 0 }}>
            {exploreMode ? "Explore" : "Query"}
          </span>
          <button
            type="button"
            onClick={() => setExploreMode(!exploreMode)}
            style={{
              position: "relative",
              width: 44,
              height: 22,
              borderRadius: 11,
              border: "1px solid var(--color-border)",
              background: exploreMode ? "var(--color-accent-soft)" : "var(--color-surface)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              padding: 0,
            }}
            title={exploreMode ? "Switch to Query mode" : "Switch to Explore mode"}
          >
            <span
              style={{
                position: "absolute",
                top: 2,
                left: exploreMode ? 22 : 2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: exploreMode ? "var(--color-accent)" : "var(--color-text-dim)",
                transition: "all 0.2s ease",
                boxShadow: exploreMode ? "0 0 8px rgba(0,255,136,0.4)" : "none",
              }}
            />
          </button>
        </div>

        {/* Textarea and submit */}
        <div className="flex gap-3">
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
            className="input-field"
            style={{
              flex: 1,
              resize: "none",
              borderRadius: 6,
              lineHeight: 1.6,
            }}
          />
          <button
            type="submit"
            disabled={!queryText.trim() || cli.isRunning}
            className="btn-primary"
            style={{
              alignSelf: "flex-end",
              borderRadius: 6,
              padding: "8px 20px",
              fontSize: 12,
              opacity: !queryText.trim() || cli.isRunning ? 0.4 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {cli.isRunning ? "Running..." : "Run"}
          </button>
        </div>

        <span style={{ fontSize: 10, color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
          {exploreMode ? "Explore topics with interactive navigation" : "Cmd+Enter to run"}
        </span>
      </form>

      {/* Results */}
      <div ref={resultsRef} className="flex-1 overflow-y-auto" style={{ padding: "16px" }}>
        {queryLines.length === 0 ? (
          <div className="flex items-center justify-center h-full animate-in">
            <span style={{ fontSize: 11, color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
              Run a query to see results
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            {queryLines.map((line, i) => (
              <div
                key={`${line.timestamp}-${i}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  lineHeight: 1.6,
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
