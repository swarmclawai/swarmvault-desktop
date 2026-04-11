import { useGraphServer } from "../hooks/useGraphServer"

export function GraphTab() {
  const { url, isReady } = useGraphServer()

  if (!url || !isReady) {
    return (
      <div
        className="flex items-center justify-center h-full animate-in"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span
              className="pulse-dot"
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--color-accent)",
                boxShadow: "0 0 12px rgba(0,255,136,0.5)",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.03em",
              }}
            >
              {!url
                ? "Starting graph server..."
                : `Connecting to graph server...`}
            </span>
          </div>
          <span
            style={{
              fontSize: 10,
              color: "var(--color-text-dim)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {url || "Waiting for URL"}
          </span>
        </div>
      </div>
    )
  }

  return (
    <iframe
      src={url}
      className="w-full h-full"
      style={{ border: "none", background: "var(--color-bg)" }}
      title="SwarmVault Graph Viewer"
    />
  )
}
