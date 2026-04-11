import { useState, useEffect } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface PagesTabProps {
  cli: ReturnType<typeof useCliRunner>
}

interface WikiPage {
  title: string
  path: string
}

export function PagesTab({ cli }: PagesTabProps) {
  const [pages, setPages] = useState<WikiPage[]>([])
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [pageContent, setPageContent] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Scan for pages when lines change (after compile)
  useEffect(() => {
    const lastSystemLine = [...cli.lines]
      .reverse()
      .find((l) => l.stream === "system" && l.line.includes("exited with code 0"))
    if (lastSystemLine) {
      // After a successful compile, re-check pages
      // In a full implementation this would parse the compile output
    }
  }, [cli.lines])

  async function handleCompile() {
    setLoading(true)
    await cli.run("compile")
    setLoading(false)
  }

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "var(--color-bg)" }}>
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
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Compile your vault to generate wiki pages
          </p>
          <button
            onClick={handleCompile}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
          >
            {loading ? "Compiling..." : "Compile"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full" style={{ background: "var(--color-bg)" }}>
      {/* Page list */}
      <div
        className="w-56 shrink-0 border-r overflow-y-auto"
        style={{ borderColor: "var(--color-border)", background: "var(--color-raised)" }}
      >
        {pages.map((page) => (
          <button
            key={page.path}
            onClick={() => {
              setSelectedPage(page.path)
              setPageContent(`Loading ${page.title}...`)
            }}
            className="w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer truncate block"
            style={{
              background: selectedPage === page.path ? "var(--color-accent-soft)" : "transparent",
              color: selectedPage === page.path ? "var(--color-accent)" : "var(--color-text-muted)",
            }}
          >
            {page.title}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedPage ? (
          <pre className="text-xs whitespace-pre-wrap" style={{ color: "var(--color-text)" }}>
            {pageContent}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
              Select a page to view
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
