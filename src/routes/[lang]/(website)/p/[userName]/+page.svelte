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

  export let data

  TimeAgo.addLocale(ru)

  const timeAgo = new TimeAgo('ru-RU')
</script>

<section class='hero'>
  <div class='header-block'>
    <h1>{data.pageProfile.userName}</h1>

    {#if data.pageProfile.coupons > 0}
      <div class='coupon'>
        <div class='coupons-counter'>{data.pageProfile.coupons}</div> <img src={couponSmall} alt="" width='48' height='48' />
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

    .hero .coupon {
        position: relative;
        display: inline-block;
    }

    .hero .coupons-counter {
        position: absolute;
        top: 6px;
        left: 3px;
        color: #fff;
        font-weight: 700;
        font-size: 0.8rem;
        background: var(--color-text);
        padding: 0 0.4em;
        border-radius: 50%;
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
</style>
