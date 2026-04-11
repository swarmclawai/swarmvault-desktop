import { useGraphServer } from "../hooks/useGraphServer"

export function GraphTab() {
  const { url, isReady } = useGraphServer()

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
          />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Graph server starting...
          </span>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
          />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Connecting to graph viewer at {url}...
          </span>
        </div>
      </div>
    )
  }

  return (
    <iframe
      src={url}
      className="w-full h-full border-0"
      style={{ background: "var(--color-bg)" }}
      title="SwarmVault Graph Viewer"
    />
  )
}
