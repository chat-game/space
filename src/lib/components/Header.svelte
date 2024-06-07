<script>
    import {page} from "$app/stores";
    import unit from '$lib/assets/website/unit-64.png';
    import Profile from "$lib/components/Profile.svelte";
    import {DISCORD_SERVER_INVITE_URL} from "$lib/config";
</script>

<header>
    {#if $page.url.pathname === '/'}
        <img src={unit} alt=""/>
    {:else}
        <a href="/" class="logo">
            <img src={unit} alt=""/>
        </a>
    {/if}

    <nav>
        <ul>
            <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
                <a href="/">Главная</a>
            </li>
            <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
                <a href="/about">Об игре</a>
            </li>
            <li>
                <a href={DISCORD_SERVER_INVITE_URL} target="_blank">Discord</a>
            </li>
        </ul>
    </nav>

    <Profile/>
</header>

<style>
    header {
        padding: 0.5em 1em;
        display: flex;
        justify-content: space-between;
        justify-items: center;
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

    .logo:hover {
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
        background: var(--background);
        background-size: contain;
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
