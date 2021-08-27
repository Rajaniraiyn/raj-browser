const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');
const adBlocker = require('./adblock/adblock');
const downloader = require("electron-download-manager");


// starts capturing downloads
downloader.register();


let win;

function createWindow() {
  win = new BrowserWindow({
    title: "Raj Browser",
    width: 800,
    height: 600,
    icon: './appIcons/icon.ico',
    show: false,
    frame: false,
    webPreferences: {
      devTools: true,
      preload: __dirname + '/render/js/preload.js',
      webviewTag: true,
      defaultFontFamily: "sansSerif"
    }
  });

  win.loadFile("./main/render/index.html");

  win.on('ready-to-show', _ => {
    win.show();
  })

  // starts blocking Ads
  adBlocker.then(
    (blocker) => {
      blocker.enableBlockingInSession(win.webContents.session)
    })

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


// forces light theme as of now
nativeTheme.themeSource = 'light'
