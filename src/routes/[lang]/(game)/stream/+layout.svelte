<script lang='ts'>
  import '$lib/styles/styles.css'
</script>

<div class='app'>
  <slot />
</div>

<style>
  :global(html, body) {
    background: transparent;
  }

  .app {
    min-height: 100vh;
  }
</style>
