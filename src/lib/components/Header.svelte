<script lang='ts'>
  import { page } from '$app/stores'
  import unit from '$lib/assets/website/unit-64.png'
  import Profile from '$lib/components/Profile.svelte'
  import Locale from '$lib/components/Locale.svelte'

  const locale = $page.data.locale
  const t = $page.data.t
</script>

<header>
  <div class='left logo'>
    {#if $page.url.pathname === `/${locale}`}
      <img src={unit} alt="" />
    {:else}
      <a href='/{locale}'>
        <img src={unit} alt="" />
      </a>
    {/if}
  </div>

  <nav>
    <ul>
      <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
        <a href='/{locale}'>{t.header.menu.home}</a>
      </li>
      <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
        <a href='/{locale}/about'>{t.header.menu.about}</a>
      </li>
      <li aria-current={$page.url.pathname === '/character' ? 'page' : undefined}>
        <a href='/{locale}/character'>{t.header.menu.characters}</a>
      </li>
    </ul>
  </nav>

  <Locale />

  <div class='right'>
    <Profile />
  </div>
</header>

<style>
    header {
        padding: 0.5em 1em;
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
    }

    .left, .right {
        flex-grow: 1;
        flex-basis: 0;
    }

    @keyframes skewRandom {
        0% {
            transform: skewX(0);
        }
        50% {
            transform: skewX(-3deg);
        }
        75% {
            transform: skewX(3deg);
        }
        100% {
            transform: skewX(0);
        }
    }

    .logo {
        transition: all 0.2s;
    }

    .logo a:hover img {
        animation-name: skewRandom;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        animation-direction: alternate-reverse;
        transform-origin: 50% 50%;
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
        transition: color 0.2s linear;
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
