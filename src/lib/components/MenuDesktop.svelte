<script>
  import Profile from './Profile.svelte'
  import { page } from '$app/stores'
  import couponSmall from '$lib/assets/website/coupon-64.png'
  import coinSmall from '$lib/assets/website/coin-64.png'

  const locale = $page.data.locale
  const t = $page.data.t
  const profile = $page.data.profileData
</script>

<nav>
  <ul>
    <li aria-current={$page.url.pathname === `/${locale}` ? 'page' : undefined}>
      <a href='/{locale}'>{t.header.menu.home}</a>
    </li>
    <li aria-current={$page.url.pathname === `/${locale}/about` ? 'page' : undefined}>
      <a href='/{locale}/about'>{t.header.menu.about}</a>
    </li>
    <li aria-current={$page.url.pathname === `/${locale}/character` ? 'page' : undefined}>
      <a href='/{locale}/character'>{t.header.menu.characters}</a>
    </li>
    <li aria-current={$page.url.pathname === `/${locale}/coupon` ? 'page' : undefined}>
      <a href='/{locale}/coupon'>{t.header.menu.coupon}</a>
    </li>
    <li aria-current={$page.url.pathname === `/${locale}/trophy` ? 'page' : undefined}>
      <a href='/{locale}/trophy'>{t.header.menu.trophy}</a>
    </li>
  </ul>
</nav>

<div class='right'>
  <div class='items'>
    {#if profile?.coins > 0}
      <div class='currency'>
        <div class='counter'>{profile.coins}</div> <img src={coinSmall} alt="" width='32' height='32' />
      </div>
    {/if}

    {#if profile?.coupons > 0}
      <div class='currency'>
        <div class='counter'>{profile.coupons}</div> <img src={couponSmall} alt="" width='32' height='32' />
      </div>
    {/if}

    <Profile />
  </div>
</div>

<style>
    .right {
        flex-grow: 1;
        flex-basis: 0;
        margin-left: auto;

        & .items {
          margin-left: auto;
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
    }

    nav {
        display: flex;
        justify-content: center;
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        color: inherit;
        font-weight: 700;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0;
        text-decoration: none;
        transition: color 0.2s;
    }

    nav a:hover {
        color: var(--green-9);
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.2em;
        list-style: none;
    }

    li {
        position: relative;
        display: flex;
        gap: 0.2em;
        height: 100%;
    }

    li[aria-current='page'] a {
        color: var(--green-9);
    }

    .currency {
        position: relative;
        display: inline-block;

        & .counter {
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
    }
  </style>
