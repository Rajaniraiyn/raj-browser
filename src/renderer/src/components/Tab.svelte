<script lang="ts">
  import normalizeURL from 'normalize-url'
  import type { Tab } from './types'

  import dismiss from '../assets/icons/dismiss.svg'
  import arrow_clockwise from '../assets/icons/arrow_clockwise.svg'

  export let tabs: Tab[]
  export let url: string
  export let id: string

  let title: string
  let isLoading: boolean = true
  let favicon

  async function closeTab() {
    console.log('close tab')
    window.electron.ipcRenderer.send('close-tab', id)
    tabs = tabs.filter((tab) => tab.id !== id)
    console.log('close tab id', id)
  }

  async function updateCanGo() {
    const canGo = await window.electron.ipcRenderer.invoke('can-go', id)
    tabs = tabs.map((tab) => {
      if (tab.id === id) {
        tab.canGo = canGo
      }
      return tab
    })
  }

  async function switchActive() {
    window.electron.ipcRenderer.send('active-tab', id)
  }

  window.electron.ipcRenderer.on(`tab-${id}-title-updated`, (_event, $title) => {
    title = $title
  })

  window.electron.ipcRenderer.on(`tab-${id}-favicon-updated`, (_event, favicons) => {
    favicon = favicons[0]
  })

  window.electron.ipcRenderer.on(`tab-${id}-will-navigate`, async (_event, $url) => {
    url = $url
    tabs = tabs.map((tab) => {
      if (tab.id === id) {
        tab.url = $url
        updateCanGo()
      }
      return tab
    })
  })

  window.electron.ipcRenderer.on(`tab-${id}-start-loading`, () => {
    isLoading = true
  })

  window.electron.ipcRenderer.on(`tab-${id}-stop-loading`, () => {
    isLoading = false
  })

  function newURL() {
    window.electron.ipcRenderer.send('load-url', id, normalizeURL(url))
  }
</script>

<div class="tab" on:mousedown={switchActive}>
  <div class="left">
    {#if isLoading}
      <span class="loading">
        <img src={arrow_clockwise} alt="loading" />
      </span>
    {:else}
      <img class="favicon" src={favicon} alt="{url} favicon" />
    {/if}
  </div>
  <form class="address" on:submit|preventDefault={newURL}>
    <input type="text" bind:value={url} />
  </form>
  <div class="title">
    {title ?? url}
  </div>
  <div class="right">
    <span class="close" on:click={closeTab} on:keydown>
      <img src={dismiss} alt="dismiss" />
    </span>
  </div>
</div>

<style>
  .tab {
    color: black;
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: 0.75em;

    border: solid;
    padding: 0 1em;
    border-radius: 0.5em;

    user-select: none;
  }

  .title {
    max-width: 20ch;
    overflow: visible;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .left,
  .right {
    display: flex;
    gap: 0.25em;
    align-items: center;
    justify-content: center;
  }

  .favicon {
    aspect-ratio: 1;
    height: 1em;
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-size: inherit;
    text-align: center;

    -webkit-app-region: no-drag;
  }

  .tab:not(:hover, :focus) :where(.address, .close) {
    display: none;
  }

  .tab:where(:hover, :focus) .title {
    display: none;
  }

  .loading {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  span {
    cursor: pointer;
  }
</style>
