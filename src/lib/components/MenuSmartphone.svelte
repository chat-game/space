<script>
    import { page } from '$app/stores'
    import Hamburger from './Hamburger.svelte';
    import Profile from "./Profile.svelte"

    const locale = $page.data.locale
    const t = $page.data.t

    export let sidebar = false

    function closeSidebar() {
        sidebar = false
    }
</script>

<aside class:open={sidebar}>
<nav>
    <ul>
      <li aria-current={$page.url.pathname === `/${locale}` ? 'page' : undefined}>
        <a href='/{locale}' onclick={closeSidebar}>{t.header.menu.home}</a>
      </li>
      <li aria-current={$page.url.pathname === `/${locale}/about` ? 'page' : undefined}>
        <a href='/{locale}/about' onclick={closeSidebar}>{t.header.menu.about}</a>
      </li>
      <li aria-current={$page.url.pathname === `/${locale}/character` ? 'page' : undefined}>
        <a href='/{locale}/character' onclick={closeSidebar}>{t.header.menu.characters}</a>
      </li>
      <li aria-current={$page.url.pathname === `/${locale}/coupon` ? 'page' : undefined}>
        <a href='/{locale}/coupon' onclick={closeSidebar}>{t.header.menu.coupon}</a>
      </li>
    </ul>
  </nav>
</aside>

  <div class='profile-block'>
    <Profile />
  </div>

  <Hamburger bind:open={sidebar}/>

  <style>
	aside {
		left: -100%;
		transition: left 0.2s ease-in-out;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100vh;
        background-color: var(--color-bg-accent-1);
        z-index: 10;
	}

    nav {
        padding: 0 2em;
    }

    nav ul {
        padding: 0;
    }

    nav ul li {
        list-style: none;
        font-size: 1.5rem;
        padding: 0.25em 0;
    }

    nav ul li a {
        color: #fff;
    }

    li[aria-current='page'] a {
        color: var(--color-border);
    }
	
	.open {
		left: 0
	}

    .profile-block {
        margin-right: 0.5em;
    }
</style>