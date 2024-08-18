<script>
  import TimeAgo from 'javascript-time-ago'
  import ru from 'javascript-time-ago/locale/ru'
  import couponHuge from '$lib/assets/website/coupon-128.png'
  import couponSmall from '$lib/assets/website/coupon-64.png'
  import unit from '$lib/assets/website/unit-64.png'
  import { config } from '$lib/config'
  import { page } from '$app/stores'

  export let data

  const latestCoupons = data.latestCoupons.slice(0, 12)

  TimeAgo.addLocale(ru)

  const timeAgo = new TimeAgo('ru-RU')
</script>

<svelte:head>
  <title>Купон | Чат-игра для Twitch</title>
  <meta name='description' content='Что с ним делать? Как его получить?' />
</svelte:head>

<section class='hero'>
  <h1>Купон</h1>
  <h2>
    Уже встречался <a href={config.twitch.url} target='_blank'>на стриме?</a>
  </h2>

  <div class='coupons-block mt-4'>
    <img src={couponHuge} alt='banana coupon' />
    <img src={couponHuge} alt='banana coupon' />
    <img src={couponHuge} alt='banana coupon' />
  </div>
</section>

<section class='latest-coupons'>
  <h2 class='title'>Последние активации</h2>
  <p class='desc'>
    На стриме периодически появляются сообщения с инструкцией, как получить
    купон.
  </p>

  <div class='block'>
    {#each latestCoupons as coupon}
      <div class='card'>
        <div>
          <img src={unit} alt="" />
          <div class='coupon'>
            <img src={couponSmall} alt="" width='48' height='48' />
          </div>
        </div>
        <div>
          <a href='/{$page.data.locale}/p/{coupon.profile.userName}'
          >{coupon.profile.userName}</a
          >
        </div>
        <time>{timeAgo.format(new Date(coupon.createdAt))}</time>
      </div>
    {/each}
  </div>
</section>

<section class='game-info'>
  <h2 class='title'>Куда его можно потратить</h2>
  <h3 class='desc'>
    Важно: действия имеют статус "в разработке". Развлечемся!
  </h3>

  <div class='grid'>
    <div class='block bg-paper'>
      <div class='header'>
        <h3>Сеть персонажей</h3>
      </div>
      <div class='info'>
        <p>
          Персонажи "прокачиваются" за счет заметок игроков: истории, детали
          характера, визуальные свойства. Для их публикации нужны купоны.
        </p>
      </div>
    </div>
    <div class='block bg-paper'>
      <div class='header'>
        <h3>Квесты</h3>
      </div>
      <div class='info'>
        <p>
          Игроки выполняют разнообразные задания в игре, используя доступные
          команды. Квесты будем создавать вместе. Для их публикации нужны
          купоны.
        </p>
      </div>
    </div>
    <div class='block bg-paper'>
      <div class='header'>
        <h3>Игра за персонажа</h3>
      </div>
      <div class='info'>
        <p>
          Можно "арендовать" игрового персонажа на время: откроется доступ к
          странице, постам и активностям. Стоимость аренды динамичная и
          измеряется в купонах.
        </p>
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

    & .coupons-block {
      position: relative;
      width: 10em;
      margin: 1.5em auto 0;

      & img:first-child {
        position: absolute;
        top: 1em;
        left: -3.5em;
        width: 4em;
        height: 4em;
        opacity: 0.8;
      }

      & img:last-child {
        position: absolute;
        bottom: 1em;
        right: -2em;
        width: 2.5em;
        height: 2.5em;
        opacity: 0.7;
      }
    }
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5em;
  }

  @media (min-width: 768px) {
    .latest-coupons .block {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1200px) {
    .latest-coupons .block {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  .latest-coupons .block .card {
    background-color: var(--color-background-2);
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
