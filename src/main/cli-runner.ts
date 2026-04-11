import { spawn, type ChildProcess } from "child_process";
import { createRequire } from "module";
import { type BrowserWindow } from "electron";
import { randomUUID } from "crypto";
import { createInterface } from "readline";

export interface CommandHandle {
  id: string;
  process: ChildProcess;
  command: string;
  args: string[];
}

let cachedCliPath: string | null = null;

const activeCommands = new Map<string, CommandHandle>();

/**
 * Resolve the entry script for @swarmvaultai/cli using Node's require
 * resolution so it works whether the package lives inside an asar archive or
 * in plain node_modules.
 */
export function resolveCliPath(): string {
  if (cachedCliPath) return cachedCliPath;

  const require = createRequire(import.meta.url);
  cachedCliPath = require.resolve("@swarmvaultai/cli/dist/index.js");
  return cachedCliPath;
}

/**
 * Spawn a SwarmVault CLI command as a child process and stream its output to
 * the renderer via IPC.
 */
export function runCommand(
  win: BrowserWindow,
  command: string,
  args: string[],
  cwd: string,
): CommandHandle {
  const id = randomUUID();

  const child = spawn(process.execPath, [resolveCliPath(), command, ...args], {
    cwd,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      FORCE_COLOR: "0",
      NO_UPDATE_NOTIFIER: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const handle: CommandHandle = { id, process: child, command, args };
  activeCommands.set(id, handle);

  // Stream stdout line-by-line
  if (child.stdout) {
    const rl = createInterface({ input: child.stdout });
    rl.on("line", (line) => {
      if (!win.isDestroyed()) {
        win.webContents.send("cli:output", { id, stream: "stdout", line });
      }
    });
  }

  // Stream stderr line-by-line
  if (child.stderr) {
    const rl = createInterface({ input: child.stderr });
    rl.on("line", (line) => {
      if (!win.isDestroyed()) {
        win.webContents.send("cli:output", { id, stream: "stderr", line });
      }
    });
  }

  child.on("close", (code) => {
    activeCommands.delete(id);
    if (!win.isDestroyed()) {
      win.webContents.send("cli:exit", { id, code: code ?? 1 });
    }
  });

  child.on("error", (err) => {
    activeCommands.delete(id);
    if (!win.isDestroyed()) {
      win.webContents.send("cli:output", {
        id,
        stream: "stderr",
        line: `Failed to start process: ${err.message}`,
      });
      win.webContents.send("cli:exit", { id, code: 1 });
    }
  });

  return handle;
}

/**
 * Kill a running command by ID.  Sends SIGTERM first; if the process has not
 * exited after 5 seconds it escalates to SIGKILL.
 */
export function killCommand(id: string): boolean {
  const handle = activeCommands.get(id);
  if (!handle) return false;

  if (process.platform === "win32") {
    handle.process.kill();
  } else {
    handle.process.kill("SIGTERM");
  }

  const killTimeout = setTimeout(() => {
    try {
      if (process.platform === "win32") {
        handle.process.kill();
      } else {
        handle.process.kill("SIGKILL");
      }
    } catch {
      // Process already exited -- nothing to do.
    }
  }, 5_000);

  handle.process.once("close", () => {
    clearTimeout(killTimeout);
    activeCommands.delete(id);
  });

  return true;
}

/**
 * Kill every active command.  Called during app quit to ensure no orphan
 * processes are left behind.
 */
export function killAllCommands(): void {
  for (const [id] of activeCommands) {
    killCommand(id);
  }
}
