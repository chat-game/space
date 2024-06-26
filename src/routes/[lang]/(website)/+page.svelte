<script lang='ts'>
  import { onMount } from 'svelte'
  import { serverConfig } from '$lib/config'
  import { BaseGame } from '$lib/game/baseGame'
  import { pluralizationRu } from '$lib/utils/locale'

  export let data

  const profileCount = data.count
  const profileDesc = pluralizationRu(data.count, [
    'профиль',
    'профиля',
    'профилей',
  ])

  const game = new BaseGame({})
  let gameElement: HTMLElement
  let isGameReady = false
  let isGameElementActive = false

  const handleGameButtonClick = () => {
    isGameElementActive = !isGameElementActive
    game.play()
    setTimeout(() => {
      game.app.resize()
    }, 200)
  }

  const handleVisibilityChange = () => {
    game.options.isPaused = document.hidden
  }

  onMount(() => {
    const initGame = async () => {
      await game.init()

      gameElement?.appendChild(game.app.canvas)
      game.app.resizeTo = gameElement
      isGameReady = true
    }

    void initGame()

    return () => {
      game.destroy()
    }
  })
</script>

<svelte:head>
  <title>Интерактивная чат-игра для Twitch</title>
  <meta name='description' content='Стример играет вместе со своей аудиторией. Либо он делает
    перерыв, пока зрители...' />
</svelte:head>

<svelte:document onvisibilitychange={handleVisibilityChange} />

<section class='hero'>
  <h1>
    Интерактивная чат-игра для Twitch
  </h1>
  <h2>Группа игроков сопровождает Машину из точки А в точку Б, не зная, доберутся ли. Зрители могут использовать
    "!команды", которые запускают динамичные действия.</h2>
</section>

<div class='game-block'>
  <div id='game-canvas' bind:this={gameElement} data-active={isGameElementActive}></div>
  <div class='buttons-block' data-active={!isGameElementActive && isGameReady}>
    <button onclick={handleGameButtonClick} class='show-switch'>Хочу больше!</button>
  </div>
</div>

<section>
  <p>Стример играет вместе со своей аудиторией. Либо он делает
    перерыв, пока зрители развлекаются или...</p>
  <p class='mt-2'>За все время
    создано {profileCount} {profileDesc}. Присоединяйся <a
      href={serverConfig.twitch.url} target='_blank'
      class='twitch-link'>на активном
      стриме</a>!</p>
</section>

<style>
    #game-canvas {
        width: 100%;
        height: 28em;
        touch-action: none;
        transition: all 0.2s;
    }

    #game-canvas[data-active="true"] {
        height: 48em;
    }

    .game-block {
        position: relative;
        width: 100%;
        margin: 4em 0;
    }

    .game-block .buttons-block {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.2);
    }

    .game-block .buttons-block[data-active="false"] {
        visibility: hidden;
    }

    .buttons-block .show-switch {
        background: var(--color-bg-accent-1);
        color: var(--color-background);
        border: 3px solid var(--color-border);
        padding: 1.5em 2.5em;
        font-size: 1.2rem;
        transition: all 0.2s;
    }

    .buttons-block button:hover {
        transform: scale(1.05);
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
