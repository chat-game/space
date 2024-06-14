<script lang='ts'>
  import GamePlayerCard from './GamePlayerCard.svelte'
  import type { IGameObjectPlayer } from '$lib/game/types'

  const players: IGameObjectPlayer[] = []
</script>

<div class='block'>
  {#each players as player}
    <GamePlayerCard player={player} />
  {/each}
</div>

<style>
  .block {
    z-index: 10;
    position: fixed;
    top: 3.5em;
    left: 1em;
    width: 24em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
</style>
