import { useVault } from "../hooks/useVault"

export function VaultPicker() {
  const { openVault, initVault, recentVaults } = useVault()

  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      {/* Drag region */}
      <div
        className="fixed top-0 left-0 w-full"
        style={{ height: 36, WebkitAppRegion: "drag" } as React.CSSProperties}
      />

      <div
        className="w-full max-w-md rounded-xl border p-8 flex flex-col items-center gap-6"
        style={{
          background: "var(--color-raised)",
          borderColor: "var(--color-border)",
          boxShadow: "0 0 80px rgba(0,255,136,0.05)",
        }}
      >
        {/* Logo area */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
            style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}
          >
            SV
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
            SwarmVault
          </h1>
          <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
            Local-first knowledge compiler
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => openVault()}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            style={{
              background: "var(--color-accent)",
              color: "#0A0A0A",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Open Existing Vault
          </button>
          <button
            onClick={() => initVault()}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
            style={{
              background: "transparent",
              color: "var(--color-accent)",
              borderColor: "var(--color-accent)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-soft)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Create New Vault
          </button>
        </div>

        {/* Recent vaults */}
        {recentVaults.length > 0 && (
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-xs font-medium" style={{ color: "var(--color-text-dim)" }}>
              Recent Vaults
            </h3>
            <div className="flex flex-col gap-1">
              {recentVaults.map((vp) => (
                <button
                  key={vp}
                  onClick={() => openVault()}
                  className="w-full text-left px-3 py-2 rounded text-xs transition-colors cursor-pointer truncate"
                  style={{
                    background: "var(--color-surface)",
                    color: "var(--color-text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-accent)"
                    e.currentTarget.style.background = "var(--color-accent-soft)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-muted)"
                    e.currentTarget.style.background = "var(--color-surface)"
                  }}
                >
                  {vp}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
