import { useVault } from "../hooks/useVault"

export function VaultPicker() {
  const { openVault, initVault, recentVaults, loading } = useVault()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--color-bg)" }}>
        <div className="grid-pattern" />
        <div className="relative z-10 flex flex-col items-center gap-4 animate-in">
          <div className="w-12 h-12 flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 pulse-dot" style={{ background: "var(--color-accent)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Opening vault...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--color-bg)" }}>
      {/* Grid pattern */}
      <div className="grid-pattern" />

      {/* Drag region */}
      <div
        className="fixed top-0 left-0 w-full z-50"
        style={{ height: 36, WebkitAppRegion: "drag" } as React.CSSProperties}
      />

      {/* Ambient glow */}
      <div
        className="absolute"
        style={{
          width: 500,
          height: 500,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 w-full max-w-sm animate-in">
        {/* Card */}
        <div className="glass-card-elevated p-8 flex flex-col items-center gap-7">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{ background: "var(--color-accent)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
                SwarmVault
              </h1>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>
                Local-first knowledge compiler
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => openVault()} className="btn-primary glow-btn cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              Open Vault
            </button>
            <button onClick={() => initVault()} className="btn-outline cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Vault
            </button>
          </div>

          {/* Recent */}
          {recentVaults.length > 0 && (
            <div className="w-full">
              <div className="section-label" style={{ padding: "0 0 8px" }}>
                Recent
              </div>
              <div className="flex flex-col gap-1">
                {recentVaults.map((vp) => (
                  <button
                    key={vp}
                    onClick={() => openVault(vp)}
                    className="action-btn truncate cursor-pointer"
                    style={{ fontSize: 11 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon shrink-0">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="truncate">{vp.split("/").pop()}</span>
                    <span className="text-[9px] ml-auto shrink-0" style={{ color: "var(--color-text-dim)" }}>
                      {vp.split("/").slice(-2, -1)[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Version */}
        <div className="text-center mt-4">
          <span className="text-[10px]" style={{ color: "var(--color-text-dim)" }}>v0.1.2</span>
        </div>
      </div>
    </div>
  )
}
