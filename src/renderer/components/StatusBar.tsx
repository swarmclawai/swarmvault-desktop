import { useVault } from "../hooks/useVault"
import { useGraphServer } from "../hooks/useGraphServer"

export function StatusBar() {
  const { vaultPath } = useVault()
  const { port, isReady } = useGraphServer()

  const truncatedPath = vaultPath
    ? vaultPath.length > 50
      ? "..." + vaultPath.slice(-47)
      : vaultPath
    : "No vault"

  return (
    <div
      className="shrink-0 flex items-center justify-between px-3"
      style={{
        height: 24,
        background: "var(--color-raised)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Left: vault path */}
      <span
        className="text-xs truncate"
        style={{ color: "var(--color-text-dim)", fontSize: 10 }}
        title={vaultPath ?? undefined}
      >
        {truncatedPath}
      </span>

      {/* Center: graph status */}
      <span className="text-xs flex items-center gap-1.5" style={{ fontSize: 10 }}>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: isReady ? "var(--color-accent)" : "var(--color-text-dim)" }}
        />
        <span style={{ color: isReady ? "var(--color-accent)" : "var(--color-text-dim)" }}>
          Graph: {isReady ? `Ready :${port}` : "Offline"}
        </span>
      </span>

      {/* Right: version */}
      <span className="text-xs" style={{ color: "var(--color-text-dim)", fontSize: 10 }}>
        v0.1.0
      </span>
    </div>
  )
}
