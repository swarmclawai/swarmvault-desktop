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

const tabs: { key: ActiveTab; label: string }[] = [
  { key: "graph", label: "Graph" },
  { key: "pages", label: "Pages" },
  { key: "query", label: "Query" },
  { key: "review", label: "Review" },
  { key: "sources", label: "Sources" },
]

export function MainArea({ activeTab, setActiveTab, cli }: MainAreaProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* Tab bar */}
      <div
        className="flex shrink-0 border-b"
        style={{ background: "var(--color-raised)", borderColor: "var(--color-border)" }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 text-xs font-medium transition-colors cursor-pointer relative"
              style={{
                color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--color-text)"
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--color-text-muted)"
              }}
            >
              {tab.label}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--color-accent)" }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "graph" && <GraphTab />}
        {activeTab === "pages" && <PagesTab cli={cli} />}
        {activeTab === "query" && <QueryTab cli={cli} />}
        {activeTab === "review" && <ReviewPanel cli={cli} />}
        {activeTab === "sources" && <SourceManager cli={cli} />}
      </div>
    </div>
  )
}
