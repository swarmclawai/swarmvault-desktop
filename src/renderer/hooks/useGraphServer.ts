import { useState, useEffect, useCallback, useRef } from "react"
import { useVault } from "./useVault"

interface GraphServerState {
  port: number | null
  isReady: boolean
  url: string | null
}

export function useGraphServer(): GraphServerState {
  const { graphPort, vaultPath } = useVault()
  const [isReady, setIsReady] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const url = graphPort ? `http://localhost:${graphPort}` : null

  const checkReady = useCallback(async () => {
    if (!url) {
      setIsReady(false)
      return
    }
    try {
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(2000) })
      setIsReady(res.ok)
    } catch {
      setIsReady(false)
    }
  }, [url])

  useEffect(() => {
    if (!url) {
      setIsReady(false)
      return
    }

    checkReady()
    intervalRef.current = setInterval(checkReady, 3000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [url, checkReady, vaultPath])

  return { port: graphPort, isReady, url }
}
