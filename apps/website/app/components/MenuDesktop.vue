<template>
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

  <div class="right">
    <div class="items">
      <MenuProfile />
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, user } = useUserSession()
const localePath = useLocalePath()

const links = [
  {
    name: 'Главная',
    path: '/',
  },
  {
    name: 'Персонажи',
    path: '/character',
  },
  {
    name: 'Задания',
    path: '/quest',
  },
  {
    name: 'Трофеи',
    path: '/trophy',
  },
  {
    name: 'Купон',
    path: '/coupon',
  },
]
</script>

<style scoped>
.right {
  flex-grow: 1;
  flex-basis: 0;
  margin-left: auto;

  .items {
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
      color: var(--green-9);
    }
  }

  .active a {
    color: var(--green-9);
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
