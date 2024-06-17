<script lang='ts'>
  import GameEventCard from './GameEventCard.svelte'
  import type { IGameEvent } from '$lib/game/services/interface'

  export let events: IGameEvent[] = []
</script>

<div class='block'>
  {#each events as event}
    <GameEventCard event={event} />
  {/each}
</div>

<style>
  .block {
    z-index: 10;
    position: absolute;
    top: 3.5em;
    right: 1em;
    width: 24em;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 1.25em;
  }
</style>
