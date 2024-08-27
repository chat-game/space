<template>
  <section class="hero">
    <h1>
      Об игре
    </h1>
    <h2>Фундамент уже готов. <br>Идет большой процесс проработки деталей и создания основного геймплея.</h2>
    <h3 class="mt-4">
      Ориентир - конец лета 2024.
    </h3>
  </section>

  <section class="game-info">
    <div class="block bg-paper">
      <div class="header">
        <h3>Необычный input</h3>
      </div>
      <div class="info">
        <p>
          Для создания юнита и выполнения разнообразных действий в игре требуется писать команды в Twitch чате.
          Например, написав команду "!рубить", юнит начнет рубить ближайшее дерево.
        </p>
      </div>
    </div>
    <div class="block bg-paper">
      <div class="header">
        <h3>Генерируемые локации</h3>
      </div>
      <div class="info">
        <p>
          Путешествуя в открытом мире, игроки встречают уникальные места. Все благодаря динамичной генерации
          чанков и глубокой работе с текстурами. Нет заранее созданной игровой карты.
        </p>
      </div>
    </div>
    <div class="block bg-paper">
      <div class="header">
        <h3>Квесты</h3>
      </div>
      <div class="info">
        <p>
          Основные модификаторы игры. Активные квесты меняют доступные команды для игроков. Движение Машины также
          зависит от главного активного задания.
        </p>
      </div>
    </div>
  </section>

  <div class="wagon-block">
    <div class="wagon">
      <img src="~/assets/img/wagon-full.png" alt="">
    </div>
  </div>

  <section class="thanks">
    <h3 class="mb-2">
      Благодарности от hmbanan666
    </h3>
    <p>
      Спасибо моим зрителям: <a href="/p/sava5621">sava5621</a> за вкусные шавухи, <a href="/p/bezsovesty">BezSovesty</a> за помощь на
      старте, <a href="/p/flack_zombi">flack_zombi</a> за упорство в рубке деревьев, <a href="/p/player_mmcm">player_mmcm</a> за первые тесты Дополнения, <a href="/p/a_hywax">a_hywax</a> за помощь с open source, <a href="/p/peregonstream">PeregonStream</a> и <a href="/p/siberiacancode">siberiacancode</a> за крутые рейды.
      Спасибо <a href="/p/tozikab_">tozikab_</a>, <a href="/p/6alt1ca">6alt1ca</a>, <a href="/p/derailon">derailon</a>, <a href="/p/sloghniy">sloghniy</a>, <a href="/p/man0ol">MaN0ol</a>, <a href="/p/do_oy">dO_Oy</a>, <a href="/p/vombatdrago">VombatDrago</a>,
      <a href="/p/sleeplessness8">sleeplessness8</a>.
      <br>Вы все крутые!
    </p>
  </section>
</template>

<style scoped>
  .game-info {
    padding-top: 2em;
    padding-bottom: 4em;
    max-width: 64em;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1em;
  }

  @media (min-width: 620px) {
    .game-info {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1020px) {
    .game-info {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .game-info .block {
    border: 3px solid var(--color-border);
  }

  .block .header {
    padding: 1.2em 1em;
    color: var(--color-background);
    background: var(--color-bg-accent-1);
  }

  .block .info {
    padding: 1em 1em;
  }

  .block .info p {
    font-weight: 500;
  }

  .mb-2 {
    margin-bottom: 0.5em;
  }

  .mt-4 {
    margin-top: 1.5em;
  }

  .wagon-block {
    width: 100%;
    margin: 2em 0;
    padding: 4em 0;
    background-image: url(~/assets/img/background-green.webp);
  }

  .wagon {
    margin: 0 auto;
    width: fit-content;
    text-align: center;
  }

  .wagon img {
    width: 60vw;
    max-width: fit-content;
  }

  .thanks {
    a {
      font-weight: 600;
    }
  }
</style>
