<script>
import Warehouse from "lucide-svelte/icons/warehouse"
import GameItem from "./GameItem.svelte"

const items = []
</script>

<div class="block">
  <div class="warehouse">
    <Warehouse/>
    <p>Warehouse</p>
  </div>

  <div class="wrapper">
    {#each items as item}
      <GameItem/>
    {/each}
  </div>
</div>

<style>
  .block {
    display: flex;
    flex-direction: row;
    gap: 0.75em;
    align-items: center;
  }

  .warehouse {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;
  }
</style>