import { ipcMain, dialog, type BrowserWindow } from "electron";
import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import Store from "electron-store";
import { runCommand, killCommand } from "./cli-runner";
import { startGraphServer, stopGraphServer, getGraphPort } from "./graph-server";

const store = new Store({ name: "swarmvault-desktop" });

let currentVaultPath: string | null = null;

/**
 * Prepend a vault path to the recent-vaults list, deduplicating and capping
 * the list at 10 entries.
 */
function addRecentVault(vaultPath: string): void {
  const existing = (store.get("recentVaults", []) as string[]).filter(
    (p) => p !== vaultPath,
  );
  const updated = [vaultPath, ...existing].slice(0, 10);
  store.set("recentVaults", updated);
}

/**
 * Register all IPC handlers that the renderer can invoke via the preload
 * bridge.  Call this once during app startup, passing the main BrowserWindow.
 */
export function registerIpcHandlers(win: BrowserWindow): void {
  // ---- vault management ----

  ipcMain.handle("vault:open", async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
      title: "Open SwarmVault Workspace",
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const vaultPath = result.filePaths[0];
    const configPath = join(vaultPath, "swarmvault.config.json");

    if (!existsSync(configPath)) {
      return {
        error: "Not a SwarmVault workspace. Run 'swarmvault init' first.",
      };
    }

    currentVaultPath = vaultPath;
    addRecentVault(vaultPath);

    try {
      const port = await startGraphServer(vaultPath);
      return { path: vaultPath, port };
    } catch (err) {
      return {
        path: vaultPath,
        port: null,
        warning: `Graph server failed to start: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  });

  ipcMain.handle("vault:init", async (_e, dirPath: string) => {
    if (!dirPath) {
      const result = await dialog.showOpenDialog(win, {
        properties: ["openDirectory"],
        title: "Choose Directory for New Vault",
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { canceled: true };
      }
      dirPath = result.filePaths[0];
    }

    const handle = runCommand(win, "init", [], dirPath);
    return { id: handle.id, path: dirPath };
  });

  ipcMain.handle("vault:current", () => {
    return currentVaultPath;
  });

  ipcMain.handle("vault:close", () => {
    stopGraphServer();
    currentVaultPath = null;
  });

  // ---- CLI execution ----

  ipcMain.handle("cli:run", (_e, command: string, args: string[]) => {
    if (!currentVaultPath) {
      return { error: "No vault open" };
    }
    const handle = runCommand(win, command, args ?? [], currentVaultPath);
    return { id: handle.id };
  });

  ipcMain.handle("cli:kill", (_e, id: string) => {
    return killCommand(id);
  });

  // ---- graph ----

  ipcMain.handle("graph:port", () => {
    return getGraphPort();
  });

  // ---- app-level ----

  ipcMain.handle("app:recent-vaults", () => {
    return store.get("recentVaults", []) as string[];
  });

  ipcMain.handle("app:clear-recent-vaults", () => {
    store.set("recentVaults", []);
  });

  // ---- wiki pages ----

  ipcMain.handle("vault:list-pages", async () => {
    if (!currentVaultPath) return { error: "No vault open" };
    const wikiDir = join(currentVaultPath, "wiki");
    try {
      const entries = await readdir(wikiDir, { recursive: true });
      const pages = entries
        .filter((e: string) => e.endsWith(".md"))
        .map((e: string) => e.replace(/\\/g, "/")) // normalize Windows paths
        .sort();
      return { pages };
    } catch {
      return { pages: [] };
    }
  });

  ipcMain.handle("vault:read-page", async (_e, pagePath: string) => {
    if (!currentVaultPath) return { error: "No vault open" };
    // Prevent path traversal
    const resolved = join(currentVaultPath, "wiki", pagePath);
    if (!resolved.startsWith(join(currentVaultPath, "wiki"))) {
      return { error: "Invalid path" };
    }
    try {
      const content = await readFile(resolved, "utf-8");
      return { content };
    } catch {
      return { error: "Page not found" };
    }
  });
}
