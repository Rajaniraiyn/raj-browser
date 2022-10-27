<script lang="ts">
  const os = navigator.platform
</script>

{#if os === 'MacIntel'}
  <button>⌘</button>
{:else}
  <button>Ctrl</button>
{/if}
