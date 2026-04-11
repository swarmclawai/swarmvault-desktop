import { autoUpdater } from "electron-updater";
import { BrowserWindow } from "electron";

/**
 * Initialize the auto-updater.  Checks for updates on launch and notifies the
 * user when one is available.  Downloads happen in the background; the user is
 * prompted to restart once the download completes.
 */
export function initAutoUpdater(win: BrowserWindow): void {
  // Don't auto-download -- let us control the flow.
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-available", (info) => {
    if (!win.isDestroyed()) {
      win.webContents.send("updater:available", {
        version: info.version,
      });
    }
    // Start downloading in the background.
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on("update-downloaded", (info) => {
    if (!win.isDestroyed()) {
      win.webContents.send("updater:downloaded", {
        version: info.version,
      });
    }
  });

  autoUpdater.on("error", (err) => {
    // Silently ignore update errors -- the app should still work.
    console.error("Auto-updater error:", err.message);
  });

  // Check for updates shortly after launch to avoid slowing down startup.
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {
      // Offline or misconfigured -- silently ignore.
    });
  }, 5_000);
}

/**
 * Quit and install the downloaded update.
 */
export function quitAndInstall(): void {
  autoUpdater.quitAndInstall();
}
