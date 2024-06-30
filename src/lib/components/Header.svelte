<script lang='ts'>
  import MenuSmartphone from './MenuSmartphone.svelte'
  import MenuDesktop from './MenuDesktop.svelte'
  import Locale from './Locale.svelte'
  import unit from '$lib/assets/website/unit-64.png'
  import { page } from '$app/stores'

  const locale = $page.data.locale

  let innerWidth = 0
  let open = false
</script>

<svelte:window bind:innerWidth />

<header>
  <div class='left logo'>
    {#if $page.url.pathname === `/${locale}`}
      <img src={unit} alt="" />
    {:else}
      <a href='/{locale}'>
        <img src={unit} alt="" />
      </a>
    {/if}

    <Locale />
  </div>

  {#if innerWidth < 768}
    <MenuSmartphone bind:sidebar={open} />
  {:else}
    <MenuDesktop />
  {/if}
</header>

<style>
    header {
        padding: 0.5em 1em;
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
    }

    @media (max-width: 768px) {
      header {
        padding: 0.5em 0.5em;
      }
    }

    .left {
        flex-grow: 1;
        flex-basis: 0;
        display: flex;
        align-items: center;
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

    .logo a {
      font-size: 0;
    }

    .logo a:hover img {
        animation-name: skewRandom;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        animation-direction: alternate-reverse;
        transform-origin: 50% 50%;
    }
</style>
