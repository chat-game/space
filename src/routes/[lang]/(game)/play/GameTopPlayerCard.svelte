<script lang='ts'>
  import GameUnit from './GameUnit.svelte'
  import type { GameObjectPlayer, PlayerTitle } from '$lib/game/types'

  export let player: GameObjectPlayer
  export let title: PlayerTitle
  export let points: string

  function getBorderColorByType(type: PlayerTitle['type']) {
    if (type === 'RICH') {
      return '#12A594'
    }
    if (type === 'FAMOUS') {
      return '#0090FF'
    }
    if (type === 'VIEWER') {
      return '#6E56CF'
    }
    if (type === 'RAIDER') {
      return '#696E77'
    }
    if (type === 'VILLAIN') {
      return '#E5484D'
    }
    if (type === 'REFUELLER') {
      return '#63706B'
    }
    if (type === 'WOODSMAN') {
      return '#30A46C'
    }
    if (type === 'MINER') {
      return '#B4B4B4'
    }
  }

  const borderColor = getBorderColorByType(title.type)
</script>

<div class='block' style='border-color: {borderColor}'>
  <div class='player'>
    <GameUnit />
  </div>
  <p class='name'>{player.userName}</p>
  <p>{title.title}! {points}</p>
</div>

<style>
  .block {
    position: relative;
    width: fit-content;
    min-width: 12em;
    height: auto;
    padding: 0.5em 1em;
    font-size: 1.25rem;
    line-height: 1.75rem;
    background-color: var(--color-background);
    border-color: var(--color-border);
    border-bottom-width: 6px;
    border-style: solid;
  }

  .block .player {
    position: absolute;
    left: 0.25em;
    top: -1.75em;
  }

  .name {
    padding-left: 3em;
    font-weight: 700;
  }
</style>
