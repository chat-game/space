<script lang='ts'>
  import { onMount } from 'svelte'
  import GameInterface from './GameInterface.svelte'
  import { BaseGame } from '$lib/game/baseGame.svelte'

  const game = new BaseGame()
  let gameElement: HTMLElement
  let isGameReady = $state(false)

  const handleVisibilityChange = () => {
    game.isPaused = true
  }

  const unpause = () => {
    game.isPaused = false
  }

  onMount(() => {
    const initGame = async () => {
      await game.init()
      void game.play()

      gameElement?.appendChild(game.app.canvas)
      game.app.resizeTo = gameElement

      setTimeout(() => {
        isGameReady = true
      }, 1000)
    }

    void initGame()

    return () => {
      game.destroy()
    }
  })
</script>

<svelte:document onvisibilitychange={handleVisibilityChange} />

<div class='game-block'>
  <div id='game-canvas' bind:this={gameElement}></div>

  <div class='pause-block' data-active={game.isPaused}>
    <button onclick={unpause}>Продолжить</button>
  </div>

  <GameInterface isGameReady={isGameReady} />
</div>

<style>
  .game-block {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  #game-canvas {
    width: 100%;
    height: 100%;
  }

  .pause-block {
    visibility: hidden;
    z-index: 50;
  }

  .pause-block[data-active="true"] {
    visibility: visible;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .pause-block button {
    background: var(--color-bg-accent-1);
    color: var(--color-background);
    border: 3px solid var(--color-border);
    padding: 1.5em 2.5em;
    font-size: 1.2rem;
    transition: all 0.2s;
  }

  .pause-block button:hover {
    transform: scale(1.02);
  }
</style>
