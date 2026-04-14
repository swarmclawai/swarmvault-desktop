/**
 * Browser mock for window.swarmvault API.
 * Used when the renderer runs in a regular browser (dev/testing) instead of Electron.
 */

const noop = () => {};

const mockApi = {
  openVault: async () => ({ error: "Running in browser — Electron features unavailable" }),
  initVault: async () => {},
  getCurrentVault: async () => null as string | null,
  closeVault: async () => {},
  runCommand: async () => ({ id: "mock-" + Date.now() }),
  killCommand: async () => {},
  getGraphPort: async () => null as number | null,
  getRecentVaults: async () => [] as string[],
  clearRecentVaults: async () => {},
  listPages: async () => ({ pages: [] as string[] }),
  readPage: async () => ({ content: "" }),
  pickIngestTargets: async () => ({ canceled: true }),
  readConfig: async () => ({ content: "{}", path: "" }),
  writeConfig: async () => ({ ok: true }),
  onCommandOutput: () => noop,
  onCommandExit: () => noop,
  onMenuEvent: () => noop,
};

if (!window.swarmvault) {
  (window as any).swarmvault = mockApi;
}
