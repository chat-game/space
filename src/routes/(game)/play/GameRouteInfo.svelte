<script lang='ts'>
  import GameRouteItem from './GameRouteItem.svelte'
  import type { IGameRoute } from '$lib/game/services/route/interface'

  export let route: IGameRoute

  export let nowX = 0
  const startX = route.startPoint.x
  const finishX = route.endPoint.x

  const distanceAll = Math.abs(finishX - startX)
  const onePercent = Math.round(distanceAll / 100)

  const distanceNowInPercent = Math.round((nowX - startX) / onePercent)

  const distanceAllChunks = Math.round(route.chunks[route.chunks.length - 1].area.area.endX - route.chunks[0].area.area.startX)
  const onePercentAllChunks = Math.round(distanceAllChunks / 100)
</script>

<div class='block'>
  <div class='wrapper'>
    <div class='icons'>
      {#each route.chunks as chunk}
        <GameRouteItem widthInPercent={(chunk.area.area.endX - chunk.area.area.startX) / onePercentAllChunks} />
      {/each}
    </div>
    <div class='progress-bar' style='width: {distanceNowInPercent}'></div>
  </div>
</div>

<style>
  .block {
    z-index: 10;
    position: fixed;
    top: 1em;
    left: 25%;
    right: 25%;
  }

  .wrapper {
    z-index: 9;
    position: relative;
    width: 100%;
    height: 2.5em;
    padding: 0.375em;
    background-color: var(--color-background);
    border-radius: 1em;
    border-color: var(--color-border);
    border-style: solid;
    border-width: 0 0 4px 0;
  }

  .icons {
    z-index: 9;
    display: flex;
    flex-direction: row;
    position: absolute;
    width: 100%;
  }

  .progress-bar {
    z-index: 10;
    height: 1.5em;
    background-color: var(--color-accent-1);
    border-radius: 1em;
  }
</style>
