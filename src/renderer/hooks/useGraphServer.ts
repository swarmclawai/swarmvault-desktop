import { useState, useEffect } from "react"
import { useVault } from "./useVault"

interface GraphServerState {
  port: number | null
  isReady: boolean
  url: string | null
}

export function useGraphServer(): GraphServerState {
  const { graphPort, vaultPath } = useVault()
  const [isReady, setIsReady] = useState(false)

  const url = graphPort ? `http://localhost:${graphPort}` : null

  useEffect(() => {
    if (!url) {
      setIsReady(false)
      return
    }

    // Reset before probing the new URL
    setIsReady(false)

    let cancelled = false

    async function check() {
      for (let i = 0; i < 15; i++) {
        if (cancelled) return
        try {
          await fetch(url!, { mode: "no-cors", signal: AbortSignal.timeout(2000) })
          // no-cors fetch resolves with opaque response (status 0) but means server is up
          if (!cancelled) setIsReady(true)
          return
        } catch {
          // not ready yet
        }
        await new Promise((r) => setTimeout(r, 1000))
      }
    }

    check()

    return () => { cancelled = true }
  }, [url, vaultPath])

  return { port: graphPort, isReady, url }
}
