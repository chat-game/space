<template>
  <nav class="hidden md:flex">
    <ul class="text-lg">
      <li v-for="link in links" :key="link.path" :class="{ active: $route.path === localePath(link.path) }">
        <NuxtLink :to="link.path">
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
</template>

<script setup lang="ts">
const { loggedIn, user } = useUserSession()
const localePath = useLocalePath()

const links = [
  {
    name: 'Игра',
    path: '/',
  },
  {
    name: 'Персонажи',
    path: '/#characters',
  },
  {
    name: 'Монеты',
    path: '/#shop',
  },
]
</script>

<style scoped>
nav {
  a {
    display: flex;
    height: 100%;
    align-items: center;
    color: inherit;
    font-weight: 600;
    letter-spacing: 0;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--color-emerald-600);
    }
  }

  .active a {
    color: var(--color-emerald-600);
  }
}

ul {
  position: relative;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.4em;
  list-style: none;
}

li {
  position: relative;
  display: flex;
  gap: 0.2em;
  height: 100%;
}
</style>
