<script lang="ts">
  import type { PageServerData } from "./$types"
  import { TWITCH_URL } from "$lib/config";
  import { Game } from "$lib/game/game";
  import { onMount } from "svelte";

  export let data: PageServerData

  let gameElement: HTMLElement

  onMount(() => {
    let game = new Game()

    const initGame = async () => {
      await game.init()
      void game.play()

      gameElement?.appendChild(game.app.canvas)
      game.app.resizeTo = gameElement
    }

    void initGame()

    return () => {
      game.destroy()
    }
  })
</script>

<svelte:head>
    <title>Интерактивная чат-игра для Twitch</title>
    <meta name="description" content="Стример играет вместе со своей аудиторией. Либо он делает
        перерыв, пока зрители..."/>
</svelte:head>

<section class="hero">
    <h1>
        Интерактивная чат-игра для Twitch
    </h1>
    <h2>Группа игроков сопровождает Машину из точки А в точку Б, не зная, доберутся ли. Зрители могут использовать
        "!команды", которые запускают динамичные действия.</h2>
</section>

<div class="game-block">
    <div id="game-canvas" bind:this={gameElement}/>
</div>

<section>
    <p>Стример играет вместе со своей аудиторией. Либо он делает
        перерыв, пока зрители развлекаются или...</p>
    <p class="mt-2">За все время создано {data.playersCount} юнитов. Присоединяйся <a href={TWITCH_URL} target="_blank"
                                                                                      class="twitch-link">на активном
        стриме</a>!</p>
</section>

<style>
    #game-canvas {
        width: 100%;
        height: 28em;
    }

    .game-block {
        width: 100%;
        padding: 4em 0;
    }

    section {
        text-align: center;
        padding: 2em 1em;
        margin: 0 auto;
        max-width: 42em;
    }

    .hero {
        padding-top: 4em;
        padding-bottom: 4em;
        max-width: 64em;
    }

    h1 {
        width: 100%;
        margin-bottom: 0.25em;
    }

    h2 {
        text-align: center;
    }

    .twitch-link {
        color: var(--color-twitch);
    }

    .mt-2 {
        margin-top: 1em;
    }
</style>
