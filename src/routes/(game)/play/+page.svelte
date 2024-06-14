<script lang="ts">
import { Game } from "$lib/game/game"
import { onMount } from "svelte"
import GameInterface from "./GameInterface.svelte"

const game = new Game()
let gameElement: HTMLElement
let isGameReady = false
let isGameElementActive = true

const handleGameButtonClick = () => {
  isGameElementActive = !isGameElementActive
  game.play()
  setTimeout(() => {
    game.app.resize()
  }, 200)
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

<div class="game-block">
  <div id="game-canvas" bind:this={gameElement} data-active={isGameElementActive}/>
<!--  <div class="buttons-block" data-active={!isGameElementActive && isGameReady}>-->
<!--    <button on:click={handleGameButtonClick} class="show-switch">Хочу больше!</button>-->
<!--  </div>-->
  <GameInterface isGameReady={isGameReady}/>
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