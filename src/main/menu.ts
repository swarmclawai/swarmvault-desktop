import { Menu, shell, type BrowserWindow, app, type MenuItemConstructorOptions } from "electron";

const isMac = process.platform === "darwin";

/**
 * Build and set the native application menu.
 */
export function buildMenu(win: BrowserWindow): void {
  const macAppMenu: MenuItemConstructorOptions = {
    label: app.name,
    submenu: [
      { role: "about", label: "About SwarmVault" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" },
    ],
  };

  const fileMenu: MenuItemConstructorOptions = {
    label: "File",
    submenu: [
      {
        label: "Open Vault\u2026",
        accelerator: "CmdOrCtrl+O",
        click: () => win.webContents.send("menu:open-vault"),
      },
      {
        label: "Init New Vault\u2026",
        click: () => win.webContents.send("menu:init-vault"),
      },
      { type: "separator" },
      {
        label: "Close Vault",
        click: () => win.webContents.send("menu:close-vault"),
      },
      ...(isMac
        ? []
        : ([
            { type: "separator" },
            { role: "quit", label: "Exit" },
          ] as MenuItemConstructorOptions[])),
    ],
  };

  const editMenu: MenuItemConstructorOptions = {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" },
    ],
  };

  const viewMenu: MenuItemConstructorOptions = {
    label: "View",
    submenu: [
      {
        label: "Toggle Sidebar",
        accelerator: "CmdOrCtrl+B",
        click: () => win.webContents.send("menu:toggle-sidebar"),
      },
      {
        label: "Toggle Terminal",
        accelerator: "CmdOrCtrl+`",
        click: () => win.webContents.send("menu:toggle-terminal"),
      },
      { type: "separator" },
      { role: "reload", accelerator: "CmdOrCtrl+R" },
      { role: "toggleDevTools" },
    ],
  };

  const helpMenu: MenuItemConstructorOptions = {
    label: "Help",
    submenu: [
      {
        label: "Documentation",
        click: () => shell.openExternal("https://www.swarmvault.ai/docs"),
      },
      ...(isMac
        ? []
        : ([
            { type: "separator" },
            {
              label: "About SwarmVault",
              click: () =>
                app.showAboutPanel(),
            },
          ] as MenuItemConstructorOptions[])),
    ],
  };

  const template: MenuItemConstructorOptions[] = [
    ...(isMac ? [macAppMenu] : []),
    fileMenu,
    editMenu,
    viewMenu,
    helpMenu,
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
