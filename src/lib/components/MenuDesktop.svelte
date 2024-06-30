<script>
  import Profile from './Profile.svelte'
  import { page } from '$app/stores'

  const locale = $page.data.locale
  const t = $page.data.t
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
  </ul>
</nav>

<div class='right'>
  <Profile />
</div>

<style>
    .right {
        flex-grow: 1;
        flex-basis: 0;
    }

    nav {
        display: flex;
        justify-content: center;
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        color: var(--color-text);
        font-weight: 700;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0;
        text-decoration: none;
        transition: color 0.2s;
    }

    nav a:hover {
        color: var(--color-accent-1);
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
        color: var(--color-accent-1);
    }
  </style>
