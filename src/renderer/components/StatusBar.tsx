import { useEffect, useState } from "react"
import { useVault } from "../hooks/useVault"
import { useGraphServer } from "../hooks/useGraphServer"

export function StatusBar() {
  const { vaultPath } = useVault()
  const { port, isReady } = useGraphServer()
  const [version, setVersion] = useState("")

  useEffect(() => {
    window.swarmvault.getAppVersion().then(setVersion).catch(() => setVersion(""))
  }, [])

  const truncatedPath = vaultPath
    ? vaultPath.length > 50
      ? "..." + vaultPath.slice(-47)
      : vaultPath
    : "No vault"

  return (
    <div className="status-bar">
      {/* Left: vault path */}
      <span className="status-bar-segment truncate" title={vaultPath ?? undefined}>
        {truncatedPath}
      </span>

      {/* Center: graph status */}
      <span className="status-bar-segment status-bar-center">
        <span
          className={`status-dot${isReady ? " pulse-dot" : ""}`}
          data-ready={isReady}
        />
        <span style={{ color: isReady ? "var(--color-accent)" : "var(--color-text-dim)" }}>
          Graph: {isReady ? `Ready :${port}` : "Offline"}
        </span>
      </span>

      {/* Right: version */}
      <span className="status-bar-segment status-bar-right">
        {version ? `v${version}` : "SwarmVault"}
      </span>
    </div>
  )
}
