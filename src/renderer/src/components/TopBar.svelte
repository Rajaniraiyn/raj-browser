<script lang="ts">
  import TabComponent from './Tab.svelte'
  import type { Tab } from './types'

  import left_icon from '../assets/icons/arrow_left.svg'
  import right_icon from '../assets/icons/arrow_right.svg'
  import add from '../assets/icons/add.svg'

  const { platform: os } = navigator
  let tabs: Tab[] = []
  let active_tab_id: string
  let active_tab: Tab

  $: active_tab = tabs.find((tab) => tab.id === active_tab_id)

  async function newTab() {
    console.log('new tab')
    active_tab_id = await window.electron.ipcRenderer.invoke('new-tab', 'https://google.com')
    tabs = [
      ...tabs,
      {
        id: active_tab_id,
        url: 'https://google.com'
      }
    ]
  }

  $: go = {
    back: () => window.electron.ipcRenderer.send('go-back', active_tab_id),
    forward: () => window.electron.ipcRenderer.send('go-forward', active_tab_id)
  }

  window.electron.ipcRenderer.on('close-tab', (_event, id) => {
    tabs = tabs.filter((tab) => tab.id !== id)
  })
</script>

<div class="top-bar">
  <div class="left">
    {#if os === 'MacIntel'}
      <div class="mac-window-controls" />
    {/if}
    <div class="navigation">
      <span class="back" class:disabled={!active_tab?.canGo?.back} on:click={go.back} on:keydown>
        <img src={left_icon} alt="left" />
      </span>
      {#if active_tab?.canGo?.forward}
        <span class="forward" on:click={go.forward} on:keydown>
          <img src={right_icon} alt="right" />
        </span>
      {/if}
    </div>
  </div>

  <div class="tabs">
    {#each tabs as { id, url }}
      <TabComponent {id} {url} bind:tabs />
    {/each}
  </div>

  <div class="right">
    <span on:click={newTab} on:keydown>
      <img src={add} alt="add" />
    </span>
    {#if os === 'Win32'}
      <div class="controls">
        <span class="close" />
        <span class="minimize" />
        <span class="maximize" />
      </div>
    {/if}
  </div>
</div>

<style>
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    -webkit-app-region: drag;
    height: 30px;
    gap: 1em;
    padding: 0 1em;
  }

  .top-bar > div > * {
    -webkit-app-region: no-drag;
  }

  .navigation {
    display: flex;
    gap: 0.5em;
  }

  .left,
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    user-select: none;
    cursor: pointer;
  }

  .mac-window-controls {
    width: 80px;
  }

  .tabs {
    display: flex;
    flex: 1;
    gap: 0.5em;
    align-items: center;
    justify-content: center;
  }
</style>
