const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  dialog,
  nativeImage
} = require("electron");
const path = require("path");
const fs = require("fs");
const { saveItem } = require("./services/saveService");

let mainWindow;
let tray;

function createWindow() {
  const windowOptions = {
    width: 700,
    height: 520,
    title: "myFiles2",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  };

  const iconPath = resolveAssetIcon(["icon.png", "icon.ico"]);
  if (iconPath) {
    windowOptions.icon = iconPath;
  }

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function resolveAssetIcon(names) {
  for (const name of names) {
    const iconPath = path.join(__dirname, "assets", name);
    if (fs.existsSync(iconPath)) {
      return iconPath;
    }
  }

  return null;
}

function loadTrayIcon() {
  const trayPath = path.join(__dirname, "assets", "tray.png");
  if (fs.existsSync(trayPath)) {
    return nativeImage.createFromPath(trayPath);
  }

  const iconPath = resolveAssetIcon(["icon.png", "icon.ico"]);
  if (iconPath) {
    return nativeImage.createFromPath(iconPath).resize({ width: 32, height: 32 });
  }

  return null;
}

function createTray() {
  const trayIcon = loadTrayIcon();
  if (!trayIcon || trayIcon.isEmpty()) {
    return;
  }

  tray = new Tray(trayIcon);

  const menu = Menu.buildFromTemplate([
    {
      label: "Open myFiles2",
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: "Exit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip("myFiles2");
  tray.setContextMenu(menu);

  tray.on("double-click", () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

ipcMain.handle("choose-file", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("save-item", async (event, payload) => {
  try {
    const result = await saveItem(payload);
    return {
      success: true,
      message: "Saved successfully.",
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Save failed."
    };
  }
});