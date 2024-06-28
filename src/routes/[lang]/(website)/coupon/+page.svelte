<script>
  import TimeAgo from 'javascript-time-ago'
  import ru from 'javascript-time-ago/locale/ru'
  import couponHuge from '$lib/assets/website/coupon-256.png'
  import couponSmall from '$lib/assets/website/coupon-64.png'
  import unit from '$lib/assets/website/unit-64.png'
  import { config } from '$lib/config'

  export let data

  TimeAgo.addLocale(ru)

  const timeAgo = new TimeAgo('ru-RU')
</script>

<svelte:head>
  <title>Купон | Чат-игра для Twitch</title>
  <meta name='description' content='Что с ним делать? Как его получить?' />
</svelte:head>

<section class='hero'>
  <h1>
    Купон
  </h1>
  <h2>Уже встречался <a href={config.twitch.url} target='_blank'>на стриме?</a></h2>

  <img src={couponHuge} alt='banana coupon' class='mt-4' />
</section>

<section class='latest-coupons'>
  <h2 class='title'>Последние активации</h2>
  <p class='desc'>На стриме периодически появляются сообщения с инструкциями.</p>

  <div class='block'>
    {#each data.latestCoupons as coupon}
      <div class='card'>
        <div>
          <img src={unit} alt="" />
          <div class='coupon'>
            <div class='coupons-counter'>{coupon.profile.coupons}</div> <img src={couponSmall} alt="" width='32' height='32' />
          </div>
        </div>
        <p>{coupon.profile.userName}</p>
        <time>{timeAgo.format(new Date(coupon.createdAt))}</time>
      </div>
    {/each}
  </div>
</section>

<section class='game-info'>
  <h2 class='title'>Куда его можно потратить</h2>
  <h3 class='desc'>Важно: действия имеют статус "в разработке". Развлечемся!</h3>

  <div class='grid'>
    <div class='block bg-paper'>
      <div class='header'>
        <h3>Сеть персонажей</h3>
      </div>
      <div class='info'>
        <p>Персонажи "прокачиваются" за счет заметок игроков: истории, детали характера, визуальные свойства. Для их публикации нужны купоны.</p>
      </div>
    </div>
    <div class='block bg-paper'>
      <div class='header'>
        <h3>Квесты</h3>
      </div>
      <div class='info'>
        <p>Игроки выполняют разнообразные задания в игре, используя доступные команды. Квесты будем создавать вместе. Для их публикации нужны купоны.</p>
      </div>
    </div>
    <div class='block bg-paper'>
      <div class='header'>
        <h3>Игра за персонажа</h3>
      </div>
      <div class='info'>
        <p>Можно "арендовать" игрового персонажа на время: откроется доступ к странице, постам и активностям. Стоимость аренды динамичная и измеряется в купонах.</p>
      </div>
    </div>
  </div>
</section>

<style>
    h1 {
      margin-bottom: 0.25em;
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

    .latest-coupons {
    padding-top: 2em;
      padding-bottom: 4em;
      max-width: 64em;
    }

    .latest-coupons .title {
        margin-bottom: 0.25em;
    }

    .latest-coupons .desc {
        margin-bottom: 1em;
    }

    .latest-coupons .block {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1em;
    }

    @media (max-width: 620px) {
        .latest-coupons .block {
            flex-direction: column;
        }
  }

    .latest-coupons .block .card {
      border: 2px solid var(--color-border-2);
      padding: 1em;
    }

    .latest-coupons .block .card time {
        font-size: 0.8rem;
    }

    .latest-coupons .block .card .coupon {
        position: relative;
        display: inline;
    }

    .latest-coupons .block .card .coupons-counter {
        position: absolute;
        bottom: 10px;
        right: 8px;
        color: #fff;
        font-weight: 700;
        font-size: 0.8rem;
        background: var(--color-bg-accent-2);
        padding: 0 0.2em;
    }

    .game-info {
      padding-top: 2em;
      padding-bottom: 4em;
      max-width: 64em;
    }

    .game-info .title {
        margin-bottom: 0.25em;
    }

    .game-info .desc {
        margin-bottom: 1.5em;
    }

    .game-info .grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1em;
    }

    @media (min-width: 620px) {
      .game-info .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1020px) {
      .game-info .grid {
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

    .mt-4 {
      margin-top: 1.5em;
    }
  </style>
