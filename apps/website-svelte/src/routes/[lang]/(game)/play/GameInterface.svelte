<script lang='ts'>
  import GameEvents from './GameEvents.svelte'
  import GameHeader from './GameHeader.svelte'
  import GameLoader from './GameLoader.svelte'
  import GamePlayersGroup from './GamePlayersGroup.svelte'
</script>

<GameLoader />
<GameHeader />
<GamePlayersGroup />
<GameEvents events={[]} />
<!-- <GameTopPlayers/> -->
