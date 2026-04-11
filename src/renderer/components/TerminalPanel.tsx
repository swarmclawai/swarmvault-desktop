import { useState, useRef, useEffect, useCallback } from "react"
import type { useCliRunner } from "../hooks/useCliRunner"

interface TerminalPanelProps {
  visible: boolean
  onToggle: () => void
  cli: ReturnType<typeof useCliRunner>
}

export function TerminalPanel({ visible, onToggle, cli }: TerminalPanelProps) {
  const [inputValue, setInputValue] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [cli.lines])

  // Focus input when panel becomes visible
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [visible])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = inputValue.trim()
      if (!trimmed) return

      // Parse command: first word is command, rest are args
      const parts = trimmed.split(/\s+/)
      const command = parts[0]
      const args = parts.slice(1)

      setHistory((prev) => [...prev, trimmed])
      setHistoryIndex(-1)
      setInputValue("")

      await cli.run(command, args)
    },
    [inputValue, cli],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        if (history.length === 0) return
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInputValue(history[newIndex])
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (historyIndex === -1) return
        if (historyIndex >= history.length - 1) {
          setHistoryIndex(-1)
          setInputValue("")
        } else {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          setInputValue(history[newIndex])
        }
      } else if (e.key === "c" && e.ctrlKey) {
        if (cli.isRunning) {
          cli.kill()
        }
      }
    },
    [history, historyIndex, cli],
  )

  const lineColor = (stream: string) => {
    switch (stream) {
      case "stderr":
        return "var(--color-danger)"
      case "system":
        return "var(--color-accent)"
      default:
        return "var(--color-text)"
    }
  }

  if (!visible) {
    // Just show a thin collapsed bar
    return (
      <div
        className="shrink-0 flex items-center justify-between px-3 cursor-pointer"
        style={{
          height: 28,
          background: "var(--color-raised)",
          borderTop: "1px solid var(--color-border)",
        }}
        onClick={onToggle}
      >
        <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
          Terminal
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--color-text-dim)" }}
        >
          <path d="M4 10l4-4 4 4" />
        </svg>
      </div>
    )
  }

  return (
    <div
      className="shrink-0 flex flex-col"
      style={{
        height: 250,
        background: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 shrink-0"
        style={{
          height: 32,
          background: "var(--color-raised)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
          Terminal
        </span>
        <div className="flex items-center gap-2">
          {cli.isRunning && (
            <button
              onClick={() => cli.kill()}
              className="text-xs px-2 py-0.5 rounded transition-colors cursor-pointer"
              style={{ color: "var(--color-danger)" }}
              title="Kill running process (Ctrl+C)"
            >
              Kill
            </button>
          )}
          <button
            onClick={() => cli.clear()}
            className="transition-colors cursor-pointer"
            style={{ color: "var(--color-text-dim)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
            title="Clear terminal"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
          <button
            onClick={onToggle}
            className="transition-colors cursor-pointer"
            style={{ color: "var(--color-text-dim)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-dim)")}
            title="Collapse terminal"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2"
        onClick={() => inputRef.current?.focus()}
      >
        {cli.lines.length === 0 ? (
          <div className="text-xs" style={{ color: "var(--color-text-dim)", lineHeight: 1.5 }}>
            Ready. Type a command below or use the sidebar actions.
          </div>
        ) : (
          cli.lines.map((line, i) => (
            <div
              key={`${line.timestamp}-${i}`}
              className="text-xs whitespace-pre-wrap break-all"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.5,
                color: lineColor(line.stream),
              }}
            >
              {line.line}
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 flex items-center px-3 gap-0"
        style={{
          height: 32,
          background: "var(--color-raised)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <span
          className="text-xs shrink-0 select-none"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--color-accent)" }}
        >
          $ swarmvault{" "}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setHistoryIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-xs"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--color-text)",
            caretColor: "var(--color-accent)",
          }}
          placeholder="command [args...]"
          autoFocus
        />
        {cli.isRunning && (
          <span className="text-xs shrink-0" style={{ color: "var(--color-text-dim)" }}>
            running...
          </span>
        )}
      </form>
    </div>
  )
}
