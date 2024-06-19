<script lang='ts'>
  import GameChunkInfo from './GameChunkInfo.svelte'
  import GameWarehouseInfo from './GameWarehouseInfo.svelte'
</script>

<div class='block'>
  <GameChunkInfo title='123' type='VILLAGE' />
  <GameWarehouseInfo items={[]} />
</div>

<style>
  .block {
    display: flex;
    flex-direction: row;
    gap: 1.5em;
    align-items: center;
  }
</style>
