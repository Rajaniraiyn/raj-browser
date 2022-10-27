import { app, shell, BrowserWindow, BrowserView, globalShortcut } from 'electron'
import { join } from 'path'
import electronDl from 'electron-dl'
import contextMenu from 'electron-context-menu'
import { electronApp, optimizer, is, ipcHelper, platform } from '@electron-toolkit/utils'
import { ElectronBlocker } from '@cliqz/adblocker-electron'
import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'

const TOP_BAR_HEIGHT = 30

let mainWindow: BrowserWindow

electronDl()

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    ...(platform.isMacOS
      ? {
          titleBarStyle: 'hiddenInset',
          trafficLightPosition: { x: 8, y: 8 },
          titleBarOverlay: {
            height: TOP_BAR_HEIGHT
          }
        }
      : {}),
    ...(process.platform === 'linux'
      ? {
          icon: join(__dirname, '../../build/icon.svg')
        }
      : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.raj.browser')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const tabs: Record<string, BrowserView> = {}

let previous_tab_id: string | null = null
let current_tab_id: string

ipcHelper.handle('new-tab', (_event, url) => {
  console.log('new-tab', url)

  previous_tab_id = current_tab_id
  current_tab_id = Math.random().toString(36).substr(2, 9)
  const tab = (tabs[current_tab_id] = new BrowserView({
    webPreferences: {
      devTools: true,
      contextIsolation: true,
      sandbox: true,
      scrollBounce: true,
      safeDialogs: true,
      autoplayPolicy: 'user-gesture-required'
    }
  }))

  tab.webContents.loadURL(url)
  startTabEvents(current_tab_id)
  mainWindow.addBrowserView(tab)
  mainWindow.setTopBrowserView(tab)

  const { width, height } = mainWindow.getBounds()
  tab.setBounds({ x: 0, y: TOP_BAR_HEIGHT, width, height: height - TOP_BAR_HEIGHT })
  tab.setAutoResize({ width: true, height: true, horizontal: true, vertical: true })

  contextMenu({
    window: tab,
    showSelectAll: true,
    showCopyImage: true,
    showCopyImageAddress: true,
    showSaveImage: true,
    showSaveLinkAs: true,
    showInspectElement: true
  })

  ElectronBlocker.fromPrebuiltFull(fetch, {
    path: 'adblock-engine.bin',
    read: readFile,
    write: writeFile
  }).then((blocker) => {
    blocker.enableBlockingInSession(tab.webContents.session)
  })

  return current_tab_id
})

ipcHelper.on('active-tab', (_event, tab_id) => {
  if (tab_id === current_tab_id) return
  current_tab_id = tab_id
  mainWindow.setTopBrowserView(tabs[tab_id])
})

ipcHelper.on('close-tab', (_event, tab_id) => {
  console.log('close-tab', tab_id)
  mainWindow.removeBrowserView(tabs[tab_id])
  delete tabs[tab_id]
  if (tab_id === current_tab_id) {
    current_tab_id = previous_tab_id ?? Object.keys(tabs)[0]
    mainWindow.setTopBrowserView(tabs[current_tab_id])
  }
})

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+W', () => {
    mainWindow.webContents.send('close-tab', current_tab_id)
    mainWindow.removeBrowserView(tabs[current_tab_id])
    delete tabs[current_tab_id]

    current_tab_id = previous_tab_id ?? Object.keys(tabs)[0]
    mainWindow.setTopBrowserView(tabs[current_tab_id])
  })
})

ipcHelper.on(`load-url`, (_event, tab_id, url) => {
  tabs[tab_id].webContents.loadURL(url)
})

ipcHelper.on(`go-back`, (_event, tab_id) => {
  tabs[tab_id].webContents.canGoBack() && tabs[tab_id].webContents.goBack()
})

ipcHelper.on(`go-forward`, (_event, tab_id) => {
  tabs[tab_id].webContents.canGoForward() && tabs[tab_id].webContents.goForward()
})

ipcHelper.on(`reload`, (_event, tab_id) => {
  tabs[tab_id].webContents.reload()
})

ipcHelper.handle('can-go', (_event, tab_id) => {
  return {
    back: tabs[tab_id].webContents.canGoBack(),
    forward: tabs[tab_id].webContents.canGoForward()
  }
})

function startTabEvents(id: string): void {
  const tab = tabs[id]
  tab.webContents.on('did-start-loading', () => {
    mainWindow.webContents.send(`tab-${id}-start-loading`)
  })

  tab.webContents.on('did-stop-loading', () => {
    mainWindow.webContents.send(`tab-${id}-stop-loading`)
  })

  tab.webContents.on('page-title-updated', (_event, title) => {
    mainWindow.webContents.send(`tab-${id}-title-updated`, title)
  })

  tab.webContents.on('page-favicon-updated', (_event, favicons) => {
    mainWindow.webContents.send(`tab-${id}-favicon-updated`, favicons)
  })

  tab.webContents.on('will-navigate', (_event, url) => {
    mainWindow.webContents.send(`tab-${id}-will-navigate`, url)
  })
}
