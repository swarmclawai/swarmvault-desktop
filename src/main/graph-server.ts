import { spawn, type ChildProcess } from "child_process";
import { createServer } from "net";
import { resolveCliPath } from "./cli-runner";

let graphProcess: ChildProcess | null = null;
let currentPort: number | null = null;

/**
 * Find a TCP port that is not currently in use, starting from `start` and
 * trying up to 100 consecutive ports.
 */
function findAvailablePort(start: number = 9470): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number): void => {
      if (port > start + 100) {
        reject(new Error(`No available port found in range ${start}-${start + 100}`));
        return;
      }

      const server = createServer();

      server.once("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
          tryPort(port + 1);
        } else {
          reject(err);
        }
      });

      server.once("listening", () => {
        server.close(() => resolve(port));
      });

      server.listen(port, "127.0.0.1");
    };

    tryPort(start);
  });
}

/**
 * Poll `http://127.0.0.1:<port>` until it responds or the timeout elapses.
 */
async function waitForServer(port: number, timeoutMs: number = 5_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  const interval = 200;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}`);
      // Any response (even 404) means the server is up.
      if (res) return;
    } catch {
      // Connection refused -- server not ready yet.
    }
    await new Promise((r) => setTimeout(r, interval));
  }

  // If we got here the server did not respond in time, but it may still be
  // starting.  Don't throw -- the caller can decide how to handle it.
}

/**
 * Start the SwarmVault graph viewer server.  If the server is already running,
 * returns the existing port immediately.
 */
export async function startGraphServer(cwd: string): Promise<number> {
  if (graphProcess && currentPort !== null) {
    return currentPort;
  }

  const port = await findAvailablePort();

  const child = spawn(
    process.execPath,
    [resolveCliPath(), "graph", "serve", "--port", String(port)],
    {
      cwd,
      env: {
        ...process.env,
        FORCE_COLOR: "0",
      },
      stdio: "ignore",
    },
  );

  graphProcess = child;
  currentPort = port;

  child.on("exit", () => {
    if (graphProcess === child) {
      graphProcess = null;
      currentPort = null;
    }
  });

  child.on("error", () => {
    if (graphProcess === child) {
      graphProcess = null;
      currentPort = null;
    }
  });

  await waitForServer(port);

  return port;
}

/**
 * Stop the graph server if it is running.
 */
export function stopGraphServer(): void {
  if (graphProcess) {
    if (process.platform === "win32") {
      graphProcess.kill();
    } else {
      graphProcess.kill("SIGTERM");
    }
    graphProcess = null;
    currentPort = null;
  }
}

/**
 * Return the port the graph server is listening on, or null if it is not
 * running.
 */
export function getGraphPort(): number | null {
  return currentPort;
}
