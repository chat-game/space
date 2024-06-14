<script lang="ts">
import type { IGameObjectPlayer } from "$lib/game/types"
import GameItem from "./GameItem.svelte"
import GameUnit from "./GameUnit.svelte"

export let player: IGameObjectPlayer

const wood = player.inventory.items.find((item) => item.type === "WOOD")?.amount
const stone = player.inventory.items.find(
  (item) => item.type === "STONE",
)?.amount
const coin = player.coins
</script>

<div class="block">
  <GameUnit/>
  <div class="info">
    <p>{player.userName}</p>
    <div class="inventory">
      <GameItem type="COIN" amount={coin} />
      <GameItem type="WOOD" amount={wood} />
      <GameItem type="STONE" amount={stone} />
    </div>
  </div>
</div>

<style>
  .block {
    width: 100%;
    height: auto;
    padding: 0.5em 1em;
    background-color: var(--color-background);
    border-color: var(--color-border);
    border-style: solid;
    border-bottom-width: 4px;
    display: flex;
    flex-direction: row;
    gap: 0.25em;
    align-items: center;
  }

  .info p {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
  }

  .info .inventory {
    display: flex;
    flex-direction: row;
    gap: 0.75em;
  }
</style>