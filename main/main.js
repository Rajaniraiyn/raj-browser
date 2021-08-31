"use strict";

var { app, BrowserWindow, nativeTheme, ipcMain, session } = require("electron");
var settings = require("./settings/browser.config");

// starts capturing downloads
if (settings.enableDownloadManager) {
  var downloader = require("electron-download-manager");
  downloader.register();
}

var win;

function createWindow() {
  win = new BrowserWindow({
    title: "Raj Browser",
    width: 800,
    height: 600,
    center: true,
    icon: "./appIcons/icon.ico",
    show: false,
    frame: false,
    backgroundColor: settings.backgroundColor,
    alwaysOnTop: settings.alwaysOnTop,
    disableAutoHideCursor: settings.hideCursorWhileTyping,
    opacity: settings.opacity,
    webPreferences: {
      nodeIntegration: settings.nodeIntegration,
      preload: __dirname + "/preload/preload.js",
      devTools: true,
      webviewTag: true,
      defaultFontFamily: settings.defaultFont,
      zoomFactor: settings.zoomFactor,
      experimentalFeatures: settings.experimentalFeatures,
      backgroundThrottling: settings.animationsAndTimersOnBackground,
      autoplayPolicy: settings.autoplayPolicy,
      disableHtmlFullscreenWindowResize: settings.disableFullScreen,
      spellcheck: settings.spellcheck,
    },
  });

  win.loadFile("./main/render/index.html");

  win.on("ready-to-show", (_) => {
    win.show();
  });

  // starts blocking Ads
  if (settings.enableAdblock) {
    var adBlocker = require("./adblock/adblock");
    adBlocker.then((blocker) => {
      blocker.enableBlockingInSession(win.webContents.session);
    });
  }
}

/**
 * for handling custom title bar buttons
 */
ipcMain.on("close-window", (_) => {
  app.quit();
});

ipcMain.on("minimize-window", (_) => {
  win.minimize();
});

ipcMain.on("maximize-window", (_) => {
  win.isMaximized() ? win.unmaximize() : win.maximize();
});

app.whenReady().then((_) => {
  createWindow();
  openProcessMgr();

  app.on("activate", (_) => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", (_) => {
  if (process.platform !== "darwin") app.quit();
});

// sets theme
// forces light theme as of now
nativeTheme.themeSource = settings.theme;

app.on("quit", (_) => {
  // removes cookies on exit
  if (settings.clearCookiesOnExit) {
    session.defaultSession.clearStorageData();
  }

  // clears cache on exit
  if (settings.clearCacheOnExit) {
    session.defaultSession.clearCache();
  }
});

// opens new process manager window
function openProcessMgr() {
  var child = new BrowserWindow({
    show: false,
    width: 500,
    height: 500,
    center: true,
    alwaysOnTop: true,
    icon: "./appIcons/icon.ico",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  child.loadFile("./main/processMgr/index.html");

  child.once("ready-to-show", (_) => {
    child.show();

    // sends total available physical memory size in KB
    child.webContents.send(
      "available-memory",
      process.getSystemMemoryInfo().total
    );

    // sends process info for every second
    var int = setInterval((_) => {
      child.webContents.send("process-info", app.getAppMetrics());
    }, 1e3);

    // removes the interval on close to prevent errors
    child.on("close", (_) => {
      clearInterval(int);
    });
  });
}

// for custom context menu
app.on("web-contents-created", (e, contents) => {
  var contextMenu = require("electron-context-menu");
  contextMenu({
    window: contents,
    labels: {
      cut: "Cut",
      copy: "Copy",
      paste: "Paste",
      save: "Save Image",
      saveImageAs: "Save Image As…",
      copyLink: "Copy Link",
      saveLinkAs: "Save Link As…",
      inspect: "Inspect Element",
      copyImage: "Copy Image to clipboard",
    },
    prepend: () => [
      {
        label: "Reload",
        click: (_) => {
          contents.reload();
        },
      },
      {
        type: "separator",
      },
    ],
    append: () => {},
    showCopyImageAddress: true,
    showCopyImage: true,
    showSaveImageAs: true,
    showInspectElement: true,
    showSaveLinkAs: true,
    showSearchWithGoogle: true,
    cut: true,
    copy: true,
    paste: true,
    save: true,
    saveImageAs: true,
    copyLink: true,
    saveLinkAs: true,
    inspect: true,
    spellCheck: true,
  });
});
