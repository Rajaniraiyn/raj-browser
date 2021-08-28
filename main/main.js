const { app, BrowserWindow, nativeTheme, ipcMain, session } = require('electron');
const adBlocker = require('./adblock/adblock');
const downloader = require("electron-download-manager");
const settings = require("./settings/browser.config");


// starts capturing downloads
if (settings.enableDownloadManager) {
  downloader.register();
}


let win;

function createWindow() {
  win = new BrowserWindow({
    title: "Raj Browser",
    width: 800,
    height: 600,
    center: true,
    icon: './appIcons/icon.ico',
    show: false,
    frame: false,
    backgroundColor: settings.backgroundColor,
    alwaysOnTop: settings.alwaysOnTop,
    disableAutoHideCursor: settings.hideCursorWhileTyping,
    opacity: settings.opacity,
    webPreferences: {
      nodeIntegration: settings.nodeIntegration,
      preload: (__dirname + '/preload/preload.js'),
      webviewTag: true,
      defaultFontFamily: settings.defaultFont,
      zoomFactor: settings.zoomFactor,
      experimentalFeatures: settings.experimentalFeatures,
      backgroundThrottling: settings.animationsAndTimersOnBackground,
      autoplayPolicy: settings.autoplayPolicy,
      disableHtmlFullscreenWindowResize: settings.disableFullScreen,
      spellcheck: settings.spellcheck
    }
  });

  win.loadFile("./main/render/index.html");

  win.on('ready-to-show', _ => {
    win.show();
  })

  // starts blocking Ads
  if (settings.enableAdblock) {
    adBlocker.then(
      (blocker) => {
        blocker.enableBlockingInSession(win.webContents.session)
      })
  }

}


/**
 * for handling custom title bar buttons
 */
ipcMain.on('close-window', _ => {
  app.quit();
});

ipcMain.on('minimize-window', _ => {
  win.minimize();
})

ipcMain.on('maximize-window', _ => {
  win.isMaximized() ? win.unmaximize() : win.maximize();
})


app.whenReady().then(_ => {
  createWindow();

  app.on('activate', _ => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', _ => {
  if (process.platform !== 'darwin') app.quit();
});


// sets theme
// forces light theme as of now
nativeTheme.themeSource = settings.theme


app.on("quit", _ => {

  // removes cookies on exit
  if (settings.clearCookiesOnExit) {
    session.defaultSession.clearStorageData([])
  }

})
