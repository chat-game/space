<template>
  <div class="hidden md:hidden">
    <aside :class="{ open: isMobileMenuOpened }">
      <nav>
        <ul>
          <li v-for="link in links" :key="link.path" :class="{ active: $route.path === localePath(link.path) }">
            <NuxtLink :to="localePath(link.path)">
              {{ link.name }}
            </NuxtLink>
          </li>

          <li v-if="loggedIn" :class="{ active: $route.path === `/p/${user?.userName}` }">
            <NuxtLink :to="localePath(`/p/${user?.userName}`)">
              Мой профиль
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <MenuHamburger />
  </div>
</template>

<script setup lang="ts">
const { isMobileMenuOpened } = useApp()
const { loggedIn, user } = useUserSession()
const localePath = useLocalePath()

const links = [
  {
    name: 'Игра',
    path: '/',
  },
]
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
</style>
