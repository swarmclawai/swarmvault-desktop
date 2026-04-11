import { useState } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface ReviewPanelProps {
  cli: ReturnType<typeof useCliRunner>
}

interface ReviewItem {
  id: string
  title: string
  description: string
  status: "pending" | "accepted" | "rejected"
}

export function ReviewPanel({ cli }: ReviewPanelProps) {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(false)

  async function handleCompile() {
    setLoading(true)
    await cli.run("compile")
    setLoading(false)
  }

  function handleAccept(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "accepted" as const } : item)),
    )
  }

  function handleReject(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" as const } : item)),
    )
  }

  if (items.length === 0) {
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
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Run compile to generate review items
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
    <div className="h-full overflow-y-auto p-4" style={{ background: "var(--color-bg)" }}>
      <div className="flex flex-col gap-3 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
            Review Items ({items.filter((i) => i.status === "pending").length} pending)
          </h2>
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-4 flex flex-col gap-2"
            style={{
              background: "var(--color-surface)",
              borderColor:
                item.status === "accepted"
                  ? "var(--color-accent)"
                  : item.status === "rejected"
                    ? "var(--color-danger)"
                    : "var(--color-border)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                  {item.title}
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                  {item.description}
                </p>
              </div>
              {item.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAccept(item.id)}
                    className="px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                    style={{ background: "var(--color-accent)", color: "#0A0A0A" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer border"
                    style={{
                      background: "transparent",
                      color: "var(--color-danger)",
                      borderColor: "var(--color-danger)",
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
              {item.status !== "pending" && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{
                    background: item.status === "accepted" ? "var(--color-accent-soft)" : "rgba(255,68,68,0.15)",
                    color: item.status === "accepted" ? "var(--color-accent)" : "var(--color-danger)",
                  }}
                >
                  {item.status === "accepted" ? "Accepted" : "Rejected"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
