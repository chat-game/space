<script>
  import GameEvents from './GameEvents.svelte'
  import GameHeader from './GameHeader.svelte'
  import GameLoader from './GameLoader.svelte'
  import GamePlayersGroup from './GamePlayersGroup.svelte'

  export let isGameReady
</script>

<GameLoader show={!isGameReady} />
<GameHeader />
<GamePlayersGroup />
<GameEvents events={[]} />
<!-- <GameTopPlayers/> -->
