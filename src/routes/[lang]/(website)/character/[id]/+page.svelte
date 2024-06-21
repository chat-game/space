<script lang='ts'>
  import type { PageServerData } from './$types'
  import unitAvatar from '$lib/assets/website/unit-512.png'
  import { page } from '$app/stores'

  export let data: PageServerData
</script>

<section class='hero'>
  <h1>{data.character.name}</h1>
  <h2>Игровой персонаж, созданный <a href='/{$page.data.locale}/p/valentina8177'>valentina8177</a></h2>

  <div class='unit-avatar'>
    <img src={unitAvatar} alt="" />
  </div>
</section>

<section class='info-block'>
  <div class='progression'>
    <div class='info'>
      <p class='lvl'>Малый</p>
      <p>Уровень проработанности</p>
    </div>

    <div class='progress-bar'>
      <div class='common'></div>
      <div class='uncommon'></div>
      <div class='rare'></div>
      <div class='epic'></div>
      <div class='legendary'></div>
    </div>
  </div>
  <div class='meta'>
    <ul>
      <li>Рубашка: Common Blue</li>
      <li>Прическа: Classic Brown</li>
      <li>Аксессуар: Нет</li>
      <li>Звук: Нет</li>
      <li>Статус Героя: Нет</li>
      <li>Уникальный URL: Нет</li>
    </ul>
  </div>
  <div class='description'>
    {data.character.description}
  </div>
</section>

<section>
  <div class='rights-block'>
    Сейчас управляет: Никто
  </div>
  <div class='feed'>
    <div class='post'>
      <p>Пример поста 3</p>
      <div class='info'>
        <div class='date'>8 часов назад</div>
        <div class='interactions'></div>
      </div>
    </div>

    <div class='post'>
      <p>Пример поста 2</p>
      <div class='info'>
        <div class='date'>2 дня назад</div>
        <div class='interactions'></div>
      </div>
    </div>

    <div class='post'>
      <p>Пример поста 1</p>
      <div class='info'>
        <div class='date'>6 дней назад</div>
        <div class='interactions'></div>
      </div>
    </div>
  </div>
</section>

<style>
    .hero {
        padding-top: 4em;
        padding-bottom: 4em;
        max-width: 64em;
    }

    h1 {
        margin-bottom: 0.25em;
    }

    section {
        text-align: center;
        padding: 2em 1em;
        margin: 0 auto;
        max-width: 42em;
    }

    .rights-block {
        display: flex;
        margin: 1em auto;
        justify-content: center;
    }

    .unit-avatar {
        width: 16em;
        height: 16em;
        margin: 2em auto 0;
        background-image: url($lib/assets/website/background-green.webp);
        border: 4px solid var(--color-border);
    }

    .unit-avatar img {
        padding: 2em;
        width: 100%;
        height: auto;
    }

    .info-block {
        max-width: 64em;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 1em;
        align-items: center;
    }

    @media (min-width: 620px) {
        .info-block {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1020px) {
        .info-block {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .progression {
        color: var(--color-background);
        background: var(--color-bg-accent-2);
        padding: 1em;
    }

    .progression .info {
        text-align: left;
        margin-bottom: 1.2em;
    }

    .progression .lvl {
        font-size: 1.8rem;
    }

    .meta {
        text-align: left;
    }

    .description {
        text-align: left;
    }

    .progress-bar {
        position: relative;
        display: flex;
        height: 0.5em;
        opacity: 0.6;
    }

    .progress-bar:before {
        content: "";
        position: absolute;
        top: -12px;
        left: 1%;
        border-style: solid;
        border-color: var(--color-background);
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
    }

    .progress-bar .common {
        background: var(--color-common);
        width: 100%;
        border-radius: 8px 0 0 8px;
    }

    .progress-bar .uncommon {
        background: var(--color-uncommon);
        width: 100%;
    }

    .progress-bar .rare {
        background: var(--color-rare);
        width: 100%;
    }

    .progress-bar .epic {
        background: var(--color-epic);
        width: 100%;
    }

    .progress-bar .legendary {
        background: var(--color-legendary);
        width: 100%;
        border-radius: 0 8px 8px 0;
    }

    .feed {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        max-width: 32em;
        margin: 0 auto;
    }

    .post {
        border: 2px solid var(--color-border);
        padding: 1em 1em;
        text-align: left;
    }

    .post .info {
        display: flex;
        justify-content: space-between;
        margin-top: 0.3em;
    }

    .post .info .date {
        font-size: 0.8rem;
    }
</style>
