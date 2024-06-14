<script lang='ts'>
  import GameTopPlayerCard from './GameTopPlayerCard.svelte'
  import type { TopPlayersResponse } from '$lib/game/types'

  export let players: TopPlayersResponse
</script>

<div class='block'>
  <div class='title'>
    Top players
  </div>

  <div class='cards'>
    <GameTopPlayerCard player={players.viewer?.player}
                       points={`${players.viewer?.points} points`}
                       title={{ title: 'Viewer', type: 'VIEWER' }} />
    <GameTopPlayerCard player={players.raider?.player}
                       points={`${players.raider?.points} viewers`}
                       title={{ title: 'Raider', type: 'RAIDER' }} />
    <GameTopPlayerCard player={players.rich?.player}
                       points={`${players.rich?.points} coins`}
                       title={{ title: 'Rich', type: 'RICH' }} />
    <GameTopPlayerCard player={players.villain?.player}
                       points={`${players.villain?.points} points`}
                       title={{ title: 'Villain', type: 'VILLAIN' }} />
    <GameTopPlayerCard player={players.famous?.player}
                       points={`${players.famous?.points} points`}
                       title={{ title: 'Good guy', type: 'FAMOUS' }} />
    <GameTopPlayerCard player={players.refueller?.player}
                       points={`${players.refueller?.points} fuel`}
                       title={{ title: 'Refueler', type: 'REFUELLER' }} />
    <GameTopPlayerCard player={players.woodsman?.player}
                       points={`${players.woodsman?.points} level`}
                       title={{ title: 'Woodman', type: 'WOODSMAN' }} />
    <GameTopPlayerCard player={players.miner?.player}
                       points={`${players.miner?.points} level`}
                       title={{ title: 'Miner', type: 'MINER' }} />
  </div>
</div>

<style>
  .block {
    z-index: 10;
    position: absolute;
    bottom: 1em;
    left: 1em;
    right: 1em;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.5em;
    align-items: flex-end;
  }

  .title {
    width: 7em;
    padding: 0.5em 0.75em;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.5rem;
    background-color: var(--color-background);
  }

  .cards {
    height: fit-content;
    display: flex;
    flex-wrap: nowrap;
    gap: 0.5em;
  }
</style>
