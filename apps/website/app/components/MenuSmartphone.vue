<template>
  <aside :class="{ open: isMobileMenuOpened }">
    <nav>
      <ul>
        <li :aria-current="$route.path === `/` ? 'page' : undefined">
          <NuxtLink to="/">
            Главная
          </NuxtLink>
        </li>
        <li :aria-current="$route.path === `/character` ? 'page' : undefined">
          <NuxtLink to="/character">
            Персонажи
          </NuxtLink>
        </li>
        <li :aria-current="$route.path === `/quest` ? 'page' : undefined">
          <NuxtLink href="/quest">
            Задания
          </NuxtLink>
        </li>
        <li :aria-current="$route.path === `/trophy` ? 'page' : undefined">
          <NuxtLink href="/trophy">
            Трофеи
          </NuxtLink>
        </li>
        <li :aria-current="$route.path === `/coupon` ? 'page' : undefined">
          <NuxtLink href="/coupon">
            Купон
          </NuxtLink>
        </li>
        <li v-if="loggedIn" :aria-current="$route.path === `/p/${user?.userName}` ? 'page' : undefined">
          <NuxtLink :href="`/p/${user?.userName}`">
            Мой профиль
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>

  <div class="profile-block">
    <MenuProfile />
  </div>

  <MenuHamburger />
</template>

<script setup lang="ts">
const { isMobileMenuOpened } = useApp()
const { loggedIn, user } = useUserSession()
</script>

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
  left: 0;
}

.profile-block {
  margin-right: 0.5em;
}
</style>
