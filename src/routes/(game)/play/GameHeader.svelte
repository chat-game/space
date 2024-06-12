<script>
import GameLocation from "./GameLocation.svelte"
</script>

<div class="block bg-paper">
  <div class="wrapper">
    <GameLocation/>
  </div>
</div>

<style>
  .block {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2.5em;
    padding: 0 1em;
    background-color: var(--color-background);
    border-style: solid;
    border-color: var(--color-border);
    border-width: 0 0 2px 0;
  }

  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>