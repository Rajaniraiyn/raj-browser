import { BrowserView, BrowserWindow } from 'electron'

type Tab = {
  id: string
  url: URL
  browserView: BrowserView
}

const { random } = Math

class Tabs extends Array<Tab> {
  currentTab: Tab | null = null

  #main: BrowserWindow

  #tab: BrowserView | null = null

  #createBrowserView() {
    return new BrowserView({
      webPreferences: {
        devTools: true,
        contextIsolation: true,
        sandbox: true,
        scrollBounce: true,
        safeDialogs: true,
        autoplayPolicy: 'user-gesture-required'
      }
    })
  }

  #newId() {
    return random().toString(36).substr(2, 9)
  }

  constructor(mainWindow: BrowserWindow, newTabURL = 'https://rajaniraiyn.github.io/Search-It/') {
    super()
    this.#main = mainWindow
    this.add(newTabURL)
  }

  add(url: string) {
    const id = this.#newId()
    this.#tab = this.#createBrowserView()

    const tab: Tab = {
      id,
      url: new URL(url),
      browserView: this.#tab
    }

    this.currentTab = tab
    this.push(this.currentTab)
  }

  dispatchEvents() {
    if (this.#tab === null || this.currentTab === null)
      throw new Error('Tab has not been Initialized yet')

    this.#tab.webContents.on('did-start-loading', () => {
      this.#main.webContents.send(`tab-${this.currentTab?.id}-start-loading`)
    })

    this.#tab.webContents.on('did-stop-loading', () => {
      this.#main.webContents.send(`tab-${this.currentTab?.id}-stop-loading`)
    })

    this.#tab.webContents.on('page-title-updated', (_event, title) => {
      this.#main.webContents.send(`tab-${this.currentTab?.id}-title-updated`, title)
    })

    this.#tab.webContents.on('page-favicon-updated', (_event, favicons) => {
      this.#main.webContents.send(`tab-${this.currentTab?.id}-favicon-updated`, favicons)
    })

    this.#tab.webContents.on('will-navigate', (_event, url) => {
      this.#main.webContents.send(`tab-${this.currentTab?.id}-will-navigate`, url)
    })
  }
}

export default Tabs
