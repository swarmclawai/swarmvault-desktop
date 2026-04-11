import { useState, useCallback, useEffect, useRef } from "react"

export interface OutputLine {
  id: string
  stream: "stdout" | "stderr" | "system"
  line: string
  timestamp: number
}

interface CliRunner {
  lines: OutputLine[]
  isRunning: boolean
  commandId: string | null
  run: (command: string, args?: string[]) => Promise<void>
  kill: () => void
  clear: () => void
  pushSystem: (line: string) => void
}

export function useCliRunner(): CliRunner {
  const [lines, setLines] = useState<OutputLine[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [commandId, setCommandId] = useState<string | null>(null)
  const activeId = useRef<string | null>(null)

  useEffect(() => {
    const unsubOutput = window.swarmvault.onCommandOutput((data) => {
      setLines((prev) => [
        ...prev,
        {
          id: data.id,
          stream: data.stream,
          line: data.line,
          timestamp: Date.now(),
        },
      ])
    })

    const unsubExit = window.swarmvault.onCommandExit((data) => {
      if (data.id === activeId.current) {
        setIsRunning(false)
        activeId.current = null
        setLines((prev) => [
          ...prev,
          {
            id: data.id,
            stream: "system",
            line: `Process exited with code ${data.code ?? "unknown"}`,
            timestamp: Date.now(),
          },
        ])
      }
    })

    return () => {
      unsubOutput()
      unsubExit()
    }
  }, [])

  const run = useCallback(async (command: string, args: string[] = []) => {
    setLines((prev) => [
      ...prev,
      {
        id: "system",
        stream: "system",
        line: `$ swarmvault ${command}${args.length ? " " + args.join(" ") : ""}`,
        timestamp: Date.now(),
      },
    ])

    const { id } = await window.swarmvault.runCommand(command, args)
    activeId.current = id
    setCommandId(id)
    setIsRunning(true)
  }, [])

  const kill = useCallback(() => {
    if (activeId.current) {
      window.swarmvault.killCommand(activeId.current)
    }
  }, [])

  const clear = useCallback(() => {
    setLines([])
  }, [])

  const pushSystem = useCallback((line: string) => {
    setLines((prev) => [
      ...prev,
      { id: "system", stream: "system", line, timestamp: Date.now() },
    ])
  }, [])

  return { lines, isRunning, commandId, run, kill, clear, pushSystem }
}
