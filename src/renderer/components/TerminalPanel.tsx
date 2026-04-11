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

  // Collapsed state: thin bar with terminal label and expand chevron
  if (!visible) {
    return (
      <div
        className="shrink-0 flex items-center px-3 cursor-pointer"
        style={{
          height: 28,
          background: "var(--color-raised)",
          borderTop: "1px solid var(--color-border)",
          gap: 10,
        }}
        onClick={onToggle}
      >
        {/* Terminal chrome dots - small */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF5F57", opacity: 0.6 }} />
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FEBC2E", opacity: 0.6 }} />
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#28C840", opacity: 0.6 }} />
        </div>
        <span style={{ fontSize: 10, color: "var(--color-text-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
          TERMINAL
        </span>
        <div style={{ flex: 1 }} />
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
      {/* Header with terminal chrome dots */}
      <div
        className="flex items-center shrink-0"
        style={{
          height: 32,
          background: "var(--color-raised)",
          borderBottom: "1px solid var(--color-border)",
          padding: "0 12px",
          gap: 10,
        }}
      >
        {/* Chrome dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#FF5F57",
              border: "0.5px solid rgba(0,0,0,0.12)",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#FEBC2E",
              border: "0.5px solid rgba(0,0,0,0.12)",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#28C840",
              border: "0.5px solid rgba(0,0,0,0.12)",
            }}
          />
        </div>

        {/* Terminal label */}
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
            color: "var(--color-text-dim)",
            textTransform: "uppercase",
          }}
        >
          Terminal
        </span>

        <div style={{ flex: 1 }} />

        {/* Right-side controls */}
        <div className="flex items-center" style={{ gap: 6 }}>
          {cli.isRunning && (
            <button
              onClick={() => cli.kill()}
              className="action-btn"
              style={{
                width: "auto",
                padding: "2px 8px",
                fontSize: 10,
                color: "var(--color-danger)",
                borderRadius: 4,
              }}
              title="Kill running process (Ctrl+C)"
            >
              Kill
            </button>
          )}
          <button
            onClick={() => cli.clear()}
            className="action-btn"
            style={{ width: "auto", padding: "2px 6px", borderRadius: 4 }}
            title="Clear terminal"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" />
            </svg>
          </button>
          <button
            onClick={onToggle}
            className="action-btn"
            style={{ width: "auto", padding: "2px 6px", borderRadius: 4 }}
            title="Collapse terminal"
          >
            <svg
              width="13"
              height="13"
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
        className="flex-1 overflow-y-auto"
        style={{ padding: "8px 12px" }}
        onClick={() => inputRef.current?.focus()}
      >
        {cli.lines.length === 0 ? (
          <div
            style={{
              fontSize: 11,
              color: "var(--color-text-dim)",
              fontFamily: "var(--font-mono)",
              lineHeight: 1.6,
            }}
          >
            Ready. Type a command below or use the sidebar actions.
          </div>
        ) : (
          cli.lines.map((line, i) => (
            <div
              key={`${line.timestamp}-${i}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
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
        className="shrink-0 flex items-center"
        style={{
          height: 34,
          background: "var(--color-raised)",
          borderTop: "1px solid var(--color-border)",
          padding: "0 12px",
          gap: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--color-accent)",
            textShadow: "0 0 10px rgba(0,255,136,0.4)",
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          {"$ swarmvault "}
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
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--color-text)",
            caretColor: "var(--color-accent)",
          }}
          placeholder="command [args...]"
          autoFocus
        />
        {cli.isRunning && (
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              border: "2px solid var(--color-border)",
              borderTopColor: "var(--color-accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              flexShrink: 0,
              marginLeft: 8,
            }}
          />
        )}
        {!cli.isRunning && (
          <span
            className="pulse-dot"
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-accent)",
              flexShrink: 0,
              marginLeft: 8,
            }}
          />
        )}
      </form>
    </div>
  )
}
