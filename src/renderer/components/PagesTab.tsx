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

  useEffect(() => { loadPages() }, [loadPages])

  useEffect(() => {
    const lastLine = [...cli.lines].reverse().find(
      (l) => l.stream === "system" && l.line.includes("exited with code 0"),
    )
    if (lastLine) loadPages()
  }, [cli.lines, loadPages])

  async function handleSelectPage(pagePath: string) {
    setSelectedPage(pagePath)
    setLoadingPage(true)
    try {
      const result = await window.swarmvault.readPage(pagePath)
      setPageContent(result.error ? `Error: ${result.error}` : (result.content ?? ""))
    } finally {
      setLoadingPage(false)
    }
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "var(--color-bg)" }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 pulse-dot" style={{ background: "var(--color-accent)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>Loading pages...</span>
        </div>
      </div>
    )
  }

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-5 max-w-xs text-center animate-in">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-dim)" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8M16 17H8M10 9H8" />
          </svg>
          <div>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No wiki pages found</p>
            <p className="text-[10px] mt-1" style={{ color: "var(--color-text-dim)" }}>Run compile to generate pages from your sources</p>
          </div>
          <button onClick={() => cli.run("compile")} disabled={cli.isRunning} className="btn-primary glow-btn cursor-pointer disabled:opacity-50" style={{ padding: "8px 24px", fontSize: 12 }}>
            {cli.isRunning ? "Compiling..." : "Compile"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full" style={{ background: "var(--color-bg)" }}>
      {/* Page list */}
      <div className="shrink-0 flex flex-col overflow-hidden" style={{ width: 220, background: "var(--color-raised)", borderRight: "1px solid var(--color-border)" }}>
        <div className="flex items-center justify-between px-3 shrink-0" style={{ height: 34, borderBottom: "1px solid var(--color-border)" }}>
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-dim)" }}>
            Pages ({pages.length})
          </span>
          <button onClick={loadPages} disabled={loading} className="cursor-pointer transition-colors disabled:opacity-50" style={{ color: "var(--color-text-dim)" }} title="Refresh">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: loading ? "spin 1s linear infinite" : undefined }}>
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => handleSelectPage(p)}
              className="action-btn truncate cursor-pointer"
              style={{
                fontSize: 11,
                padding: "5px 12px",
                background: selectedPage === p ? "var(--color-accent-soft)" : undefined,
                color: selectedPage === p ? "var(--color-accent)" : undefined,
              }}
              title={p}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon shrink-0">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
              </svg>
              <span className="truncate">{p.replace(/\.md$/, "")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedPage ? (
          <>
            <div className="px-4 shrink-0 flex items-center" style={{ height: 34, borderBottom: "1px solid var(--color-border)", background: "var(--color-raised)" }}>
              <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>wiki/</span>
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{selectedPage}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {loadingPage ? (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 pulse-dot" style={{ background: "var(--color-accent)" }} />
                  <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>Loading...</span>
                </div>
              ) : (
                <pre className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}>
                  {pageContent}
                </pre>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>Select a page to view</span>
          </div>
        )}
      </div>
    </div>
  )
}
