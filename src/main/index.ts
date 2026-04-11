import { app, BrowserWindow, shell, nativeImage } from "electron";
import { join } from "path";
import { registerIpcHandlers } from "./ipc-handlers";
import { buildMenu } from "./menu";
import { killAllCommands } from "./cli-runner";
import { stopGraphServer } from "./graph-server";
import { initAutoUpdater } from "./updater";

// Set app name (overrides "Electron" in dev mode)
app.name = "SwarmVault";

// Enforce single-instance: if a second instance launches, focus the existing
// window instead.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): BrowserWindow {
  const iconPath = join(__dirname, "../../resources/icon.png");

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    backgroundColor: "#0A0A0A",
    icon: iconPath,
    show: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Show the window once the renderer is ready to avoid a white flash.
  win.once("ready-to-show", () => {
    win.show();
  });

  // Open external links in the default browser instead of inside Electron.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  // Build the native menu for this window.
  buildMenu(win);

  // electron-vite injects the dev server URL or the production file path via
  // the MAIN_WINDOW_VITE_DEV_SERVER_URL env var at build time.  In dev mode
  // we load from the Vite dev server; in production we load the built HTML.
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return win;
}

// ---- App lifecycle ----

app.whenReady().then(() => {
  // Set dock icon (macOS)
  if (process.platform === "darwin") {
    const iconPath = join(__dirname, "../../resources/icon.png");
    try {
      const icon = nativeImage.createFromPath(iconPath);
      if (!icon.isEmpty()) app.dock.setIcon(icon);
    } catch {
      // Icon not found in dev — ignore
    }
  }

  registerIpcHandlers(() => mainWindow);
  mainWindow = createWindow();
  initAutoUpdater(mainWindow);
});

// macOS: re-create the window when the dock icon is clicked and no windows
// are open.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});

// Second instance tried to launch -- focus existing window.
app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Handle open-url events (e.g. swarmvault:// deep links on macOS).
app.on("open-url", (event, _url) => {
  event.preventDefault();
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// On non-macOS platforms, quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Clean up spawned processes before the app exits.
app.on("before-quit", () => {
  killAllCommands();
  stopGraphServer();
});
