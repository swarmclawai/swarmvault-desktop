import type { ReactNode } from "react"
import type { ActiveTab } from "../App"
import type { useCliRunner } from "../hooks/useCliRunner"
import { GraphTab } from "./GraphTab"
import { PagesTab } from "./PagesTab"
import { QueryTab } from "./QueryTab"
import { ReviewPanel } from "./ReviewPanel"
import { SourceManager } from "./SourceManager"

interface MainAreaProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  cli: ReturnType<typeof useCliRunner>
}

const tabs: { key: ActiveTab; label: string; icon: ReactNode }[] = [
  {
    key: "graph",
    label: "Graph",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="4" cy="4" r="2" />
        <circle cx="12" cy="4" r="2" />
        <circle cx="8" cy="13" r="2" />
        <path d="M5.5 5.5L7 11M10.5 5.5L9 11" />
      </svg>
    ),
  },
  {
    key: "pages",
    label: "Pages",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2h7l3 3v9H3V2z" />
        <path d="M10 2v3h3" />
        <path d="M5 8h6M5 11h4" />
      </svg>
    ),
  },
  {
    key: "query",
    label: "Query",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
    ),
  },
  {
    key: "review",
    label: "Review",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 4l7 4 7-4" />
        <path d="M1 4v8l7 4 7-4V4L8 8 1 4z" />
      </svg>
    ),
  },
  {
    key: "sources",
    label: "Sources",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="8" cy="4" rx="6" ry="2.5" />
        <path d="M2 4v4c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V4" />
        <path d="M2 8v4c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V8" />
      </svg>
    ),
  },
]

export function MainArea({ activeTab, setActiveTab, cli }: MainAreaProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* Tab bar */}
      <div
        className="flex shrink-0"
        style={{
          background: "var(--color-raised)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-btn${isActive ? " active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span style={{ display: "flex", opacity: isActive ? 1 : 0.5 }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div
        className="flex-1 min-h-0 overflow-hidden"
        style={{ background: "var(--color-bg)" }}
      >
        {activeTab === "graph" && <GraphTab />}
        {activeTab === "pages" && <PagesTab cli={cli} />}
        {activeTab === "query" && <QueryTab cli={cli} />}
        {activeTab === "review" && <ReviewPanel cli={cli} />}
        {activeTab === "sources" && <SourceManager cli={cli} />}
      </div>
    </div>
  )
}
