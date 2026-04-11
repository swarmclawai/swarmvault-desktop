import { useState, useEffect, useCallback } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface PagesTabProps {
  cli: ReturnType<typeof useCliRunner>
}

export function PagesTab({ cli }: PagesTabProps) {
  const [pages, setPages] = useState<string[]>([])
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [pageContent, setPageContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [loadingPage, setLoadingPage] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  const loadPages = useCallback(async () => {
    setLoading(true)
    try {
      const result = await window.swarmvault.listPages()
      if (result.pages) {
        setPages(result.pages)
      }
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [])

  // Load pages on mount
  useEffect(() => {
    loadPages()
  }, [loadPages])

  // Reload pages after a successful compile
  useEffect(() => {
    const lastSystemLine = [...cli.lines]
      .reverse()
      .find(
        (l) =>
          l.stream === "system" && l.line.includes("exited with code 0"),
      )
    if (lastSystemLine) {
      loadPages()
    }
  }, [cli.lines, loadPages])

  async function handleSelectPage(pagePath: string) {
    setSelectedPage(pagePath)
    setLoadingPage(true)
    try {
      const result = await window.swarmvault.readPage(pagePath)
      if (result.error) {
        setPageContent(`Error: ${result.error}`)
      } else {
        setPageContent(result.content ?? "")
      }
    } finally {
      setLoadingPage(false)
    }
  }

  async function handleCompile() {
    await cli.run("compile")
  }

  // Don't show empty state during the initial load
  if (initialLoad) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ background: "var(--color-bg)" }}
      >
        <span
          className="text-xs"
          style={{ color: "var(--color-text-dim)" }}
        >
          Loading pages...
        </span>
      </div>
    )
  }

  if (pages.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8M16 17H8M10 9H8" />
          </svg>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            No wiki pages found. Run compile to generate pages.
          </p>
          <button
            onClick={handleCompile}
            disabled={cli.isRunning}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            style={{
              background: "var(--color-accent)",
              color: "#0A0A0A",
            }}
          >
            {cli.isRunning ? "Compiling..." : "Compile"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full" style={{ background: "var(--color-bg)" }}>
      {/* Page list sidebar */}
      <div
        className="shrink-0 border-r overflow-y-auto flex flex-col"
        style={{
          width: 240,
          borderColor: "var(--color-border)",
          background: "var(--color-raised)",
        }}
      >
        {/* Sidebar header with refresh */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            Pages ({pages.length})
          </span>
          <button
            onClick={loadPages}
            disabled={loading}
            className="text-xs cursor-pointer transition-colors disabled:opacity-50"
            style={{ color: "var(--color-text-dim)" }}
            title="Refresh page list"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: loading ? "spin 1s linear infinite" : undefined,
              }}
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>

        {/* Page entries */}
        <div className="flex-1 overflow-y-auto">
          {pages.map((pagePath) => (
            <button
              key={pagePath}
              onClick={() => handleSelectPage(pagePath)}
              className="w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer truncate block"
              style={{
                background:
                  selectedPage === pagePath
                    ? "var(--color-accent-soft, rgba(255,255,255,0.06))"
                    : "transparent",
                color:
                  selectedPage === pagePath
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
              }}
              title={pagePath}
            >
              {pagePath}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedPage ? (
          <>
            {/* Breadcrumb */}
            <div
              className="px-4 py-2 border-b shrink-0"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-raised)",
              }}
            >
              <span
                className="text-xs font-mono"
                style={{ color: "var(--color-text-dim)" }}
              >
                wiki/{selectedPage}
              </span>
            </div>

            {/* Page content */}
            <div className="flex-1 overflow-y-auto p-4">
              {loadingPage ? (
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  Loading...
                </span>
              ) : (
                <pre
                  className="text-xs whitespace-pre-wrap"
                  style={{
                    color: "var(--color-text)",
                    fontFamily: "monospace",
                    margin: 0,
                  }}
                >
                  {pageContent}
                </pre>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span
              className="text-xs"
              style={{ color: "var(--color-text-dim)" }}
            >
              Select a page to view
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
