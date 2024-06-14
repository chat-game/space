<script lang="ts">
import coinImage from "$lib/assets/game/images/icons/items/coin.png"
import stoneImage from "$lib/assets/game/images/icons/items/stone.png"
import woodImage from "$lib/assets/game/images/icons/items/wood.png"
import type { IGameInventoryItem } from "$lib/game/types"

export let type: IGameInventoryItem["type"] = "WOOD"
export let amount = 0
</script>

<div class="block">
  {#if type === "WOOD"}
    <img src={woodImage} width={28} height={28} alt=""/>
  {:else if type === "STONE"}
    <img src={stoneImage} width={28} height={28} alt=""/>
  {:else if type === "COIN"}
    <img src={coinImage} width={28} height={28} alt=""/>
  {/if}

  <p>{amount}</p>
</div>

<style>
  .block {
    display: flex;
    flex-direction: row;
    gap: 0.25em;
    align-items: center;
  }

  .block p {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
</style>