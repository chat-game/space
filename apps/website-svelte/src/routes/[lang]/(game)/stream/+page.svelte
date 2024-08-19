<script lang='ts'>
  import { onMount, setContext } from 'svelte'
  import { UnitsOnStreamPlugin } from '$lib/game/stream-plugin/unitsOnStreamPlugin'

  const game = new UnitsOnStreamPlugin({ isSocketOn: true })
  setContext('game', game)
  let gameElement: HTMLElement

  onMount(() => {
    const initGame = async () => {
      await game.init()
      void game.play()

      gameElement?.appendChild(game.app.canvas)
      game.app.resizeTo = gameElement

      setTimeout(() => {
        game.options.isReady = true
      }, 1000)
    }

    void initGame()

    return () => {
      game.destroy()
    }
  })
</script>

<div class='game-block'>
  <div id='game-canvas' bind:this={gameElement}></div>
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
</style>
