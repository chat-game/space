<script lang='ts'>
  import Home from 'lucide-svelte/icons/home'
  import TreeDeciduous from 'lucide-svelte/icons/tree-deciduous'
  import Waves from 'lucide-svelte/icons/waves'
  import type { GameChunk } from '$lib/game/services/chunk/interface'

  export let type: GameChunk['type']
  export let title: string
</script>

<div class='block'>
  {#if type === 'VILLAGE'}
    <Home />
  {:else if type === 'FOREST'}
    <TreeDeciduous />
  {:else if type === 'LAKE'}
    <Waves />
  {/if}

  <p>{title}</p>
</div>

<style>
  .block {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;
  }

  .block p {
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
</style>
