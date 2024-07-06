<script lang='ts'>
  import BookCopy from 'lucide-svelte/icons/book-copy'
  import FileQuestion from 'lucide-svelte/icons/file-question'
  import Trophy from 'lucide-svelte/icons/trophy'
  import Handshake from 'lucide-svelte/icons/handshake'
  import TimeAgo from 'javascript-time-ago'
  import ru from 'javascript-time-ago/locale/ru'
  import unitAvatar from '$lib/assets/website/unit-512.png'
  import trophyImage from '$lib/assets/website/trophy-128.png'
  import { pluralizationRu } from '$lib/utils/locale'
  import couponSmall from '$lib/assets/website/coupon-64.png'
  import coinSmall from '$lib/assets/website/coin-64.png'

  export let data

  TimeAgo.addLocale(ru)

  const timeAgo = new TimeAgo('ru-RU')

  const levelProgress = [
    { level: 1, points: 0 }, // x2
    { level: 2, points: 25 },
    { level: 3, points: 50 },
    { level: 4, points: 100 },
    { level: 5, points: 200 },
    { level: 6, points: 400 },
    { level: 7, points: 800 },
    { level: 8, points: 1600 },
    { level: 9, points: 3200 },
    { level: 10, points: 6400 },
    { level: 11, points: 9600 }, // x1.5
    { level: 12, points: 14400 },
    { level: 13, points: 21600 },
    { level: 14, points: 32400 },
    { level: 15, points: 48600 },
    { level: 16, points: 72900 },
    { level: 17, points: 110000 },
    { level: 18, points: 165000 },
    { level: 19, points: 247000 },
    { level: 20, points: 370000 },
    { level: 21, points: 444000 }, // x1.2
    { level: 22, points: 532000 },
    { level: 23, points: 638000 },
    { level: 24, points: 765000 },
    { level: 25, points: 918000 },
    { level: 26, points: 1100000 },
    { level: 27, points: 1320000 },
    { level: 28, points: 1580000 },
    { level: 29, points: 1890000 },
    { level: 30, points: 2260000 },
    { level: 31, points: 2480000 }, // x1.1
    { level: 32, points: 2720000 },
    { level: 33, points: 2990000 },
    { level: 34, points: 3200000 },
    { level: 35, points: 3500000 },
    { level: 36, points: 3800000 },
    { level: 37, points: 4100000 },
    { level: 38, points: 4500000 },
    { level: 39, points: 4900000 },
    { level: 40, points: 5300000 },
    { level: 41, points: 5800000 },
    { level: 42, points: 6300000 },
    { level: 43, points: 6900000 },
    { level: 44, points: 7500000 },
    { level: 45, points: 8200000 },
    { level: 46, points: 9000000 },
    { level: 47, points: 9900000 },
    { level: 48, points: 11000000 },
    { level: 49, points: 13000000 },
    { level: 50, points: 15000000 },
  ]
</script>

<section class='hero'>
  <div class='header-block'>
    <h1>{data.pageProfile.userName}</h1>

    {#if data.pageProfile.coins > 0}
      <div class='currency'>
        <div class='counter'>{data.pageProfile.coins}</div> <img src={coinSmall} alt="" width='48' height='48' />
      </div>
    {/if}

    {#if data.pageProfile.coupons > 0}
      <div class='currency'>
        <div class='counter'>{data.pageProfile.coupons}</div> <img src={couponSmall} alt="" width='48' height='48' />
      </div>
    {/if}
  </div>
  <h2>Профиль игрока <span class='profile-lvl'>{data.pageProfile.level} уровня</span></h2>

  <div class='unit-avatar'>
    <img src={unitAvatar} alt="" />
  </div>
</section>

<section class='titles-block'>
  <div>
    <div class='icon'>
      <BookCopy size='48' />
    </div>
    <p>Рассказчик</p>
    <div class='points'>{data.pageProfile.storytellerPoints} {pluralizationRu(data.pageProfile.storytellerPoints, ['очко', 'очка', 'очков'])}</div>
  </div>

  <div>
    <div class='icon'>
      <FileQuestion size='48' />
    </div>
    <p>Создатель квестов</p>
    <div class='points'>{data.pageProfile.questCreatorPoints} {pluralizationRu(data.pageProfile.questCreatorPoints, ['очко', 'очка', 'очков'])}</div>
  </div>

  <div>
    <div class='icon'>
      <Trophy size='48' />
    </div>
    <p>Охотник за трофеями</p>
    <div class='points'>{data.pageProfile.trophyHunterPoints} {pluralizationRu(data.pageProfile.trophyHunterPoints, ['очко', 'очка', 'очков'])}</div>
  </div>

  <div>
    <div class='icon'>
      <Handshake size='48' />
    </div>
    <p>Меценат</p>
    <div class='points'>{data.pageProfile.patronPoints} {pluralizationRu(data.pageProfile.patronPoints, ['очко', 'очка', 'очков'])}</div>
  </div>
</section>

<section class='trophies'>
  <h2>Последние полученные трофеи</h2>

  {#if !data.trophies.length}
    <p>Пока нет</p>
  {/if}

  {#each data.trophies as progress}
    <div class='trophy-block'>
      <div class='info'>
        <p class='name'>{progress.trophy.name}</p>
        <p class='description'>{progress.trophy.description}</p>
        <p class='date'>{progress.status === 'COMPLETED' ? `Получен ${timeAgo.format(new Date(progress.completedAt))}` : 'Еще не получен'}</p>
      </div>
      <div class='completion'>
        <div class='trophy' data-completed={progress.status === 'COMPLETED'}>
          <img src={trophyImage} alt="" width='64' height='64' />
        </div>
        <div>
          <p class='points'>{progress.trophy.points}</p>
          <p>Очков</p>
        </div>
      </div>
    </div>
  {/each}
</section>

<section class='levels'>
  <h2>Прокачка уровня профиля</h2>
  <p>Развивая титулы "Рассказчик", "Создатель квестов", "Охотник за трофеями", "Меценат" ты получаешь очки. При накоплении очков профиль получает новый уровень.</p>
  <ul>
    {#each levelProgress as level}
      <li>{level.level} уровень: {level.points} очков</li>
    {/each}
  </ul>
</section>

<div class='profile-id'>
  {data.pageProfile.id}
</div>

<style>
    .hero {
        padding-top: 4em;
        padding-bottom: 4em;
        max-width: 64em;
    }

    .hero .header-block {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75em;
    }

    .hero .profile-lvl {
      color: var(--color-common);
    }

    .hero .currency {
        position: relative;
        display: inline-block;
    }

    .hero .currency .counter {
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        font-weight: 700;
        font-size: 0.8rem;
        background: var(--bronze-10);
        padding: 0 0.4em;
        border-radius: 6px;
    }

    .hero h1 {
        margin-bottom: 0.25em;
    }

    section {
        text-align: center;
        padding: 2em 1em;
        margin: 0 auto;
        max-width: 42em;
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

    .titles-block {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 1em;
        margin-top: 1em;
    }

    @media (min-width: 768px) {
        .titles-block {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    .titles-block .icon {
      color: var(--color-border)
    }

    .titles-block .points {
      color: var(--color-common);
      margin-top: 0.25em;
      font-size: 0.8rem;
    }

  .trophy-block {
      background-color: #FFEFD6;
      border: 2px solid var(--color-border);
      display: grid;
      grid-template-columns: 2fr 1fr;
      margin-bottom: 0.5em;
    }

    .trophy-block .info {
      position: relative;
      padding: 0.5em 1em;
    }

    .trophy-block .info .name {
      font-weight: 600;
      font-size: 1.1rem;
      opacity: 0.8;
    }

    .trophy-block .info .description {
      font-size: 0.9rem;
    }

    .trophy-block .info .date {
      font-size: 0.9rem;
      margin-top: 0.5em;
      opacity: 0.5;
    }

    .trophy-block .completion {
      position: relative;
      padding: 0.5em 1em;
      color: #F76B15;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
    }

    .trophy-block .completion .points {
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.2;
    }

    .trophy-block .completion .trophy[data-completed=false] {
      opacity: 0.3;
    }

    .profile-id {
      font-size: 0.8rem;
      opacity: 0.3;
      margin-top: 2em;
      text-align: center;
    }

    .trophies {
      h2 {
        margin-bottom: 0.5em;
      }
    }

    .levels {
      margin-top: 1em;

      ul {
        text-align: left;
        list-style: image-set(url($lib/assets/website/coin-16.png));

        li {
          margin-bottom: 0.5em;
        }
      }

      h2 {
        margin-bottom: 0.25em;
      }
    }
</style>
