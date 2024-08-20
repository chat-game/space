<script setup lang="ts">
const route = useRoute()
const website = useWebsiteStore()

function closeSidebar() {
	website.isMobileMenuOpened = false
}
</script>

<template>
  <aside :class="{open: website.isMobileMenuOpened}">
    <nav>
      <ul>
        <li :aria-current="route.path === `/` ? 'page' : undefined">
          <NuxtLink to='/' @click="closeSidebar">Главная</NuxtLink>
        </li>
        <li :aria-current="route.path === `/character` ? 'page' : undefined">
          <NuxtLink to='/character' @click="closeSidebar">Персонажи</NuxtLink>
        </li>
        <li :aria-current="route.path === `/quest` ? 'page' : undefined">
          <NuxtLink href='/quest' @click="closeSidebar">Задания</NuxtLink>
        </li>
        <li :aria-current="route.path === `/trophy` ? 'page' : undefined">
          <NuxtLink href='/trophy' @click="closeSidebar">Трофеи</NuxtLink>
        </li>
        <li :aria-current="route.path === `/coupon` ? 'page' : undefined">
          <NuxtLink href='/coupon' @click="closeSidebar">Купон</NuxtLink>
        </li>
        <!-- 
        {#if profile}
          <li aria-current={$page.url.pathname === `/${locale}/p/${profile.userName}` ? 'page' : undefined}>
            <a href='/{locale}/p/{profile.userName}' @click="closeSidebar">{t.header.menu.profile}</a>
          </li>
        {/if} -->
      </ul>
    </nav>
  </aside>

  <div class='profile-block'>
    <Profile />
  </div>

  <MenuHamburger />
</template>

<style scoped>
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