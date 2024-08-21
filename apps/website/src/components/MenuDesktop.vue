<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <nav>
    <ul>
      <li :aria-current="route.path === `/` ? 'page' : undefined">
        <NuxtLink to="/">
          Главная
        </NuxtLink>
      </li>
      <li :aria-current="route.path === `/about` ? 'page' : undefined">
        <NuxtLink to="/about">
          About
        </NuxtLink>
      </li>
      <li :aria-current="route.path === `/character` ? 'page' : undefined">
        <NuxtLink to="/character">
          Персонажи
        </NuxtLink>
      </li>
      <li :aria-current="route.path === `/quest` ? 'page' : undefined">
        <NuxtLink href="/quest">
          Задания
        </NuxtLink>
      </li>
      <li :aria-current="route.path === `/trophy` ? 'page' : undefined">
        <NuxtLink href="/trophy">
          Трофеи
        </NuxtLink>
      </li>
      <li :aria-current="route.path === `/coupon` ? 'page' : undefined">
        <NuxtLink href="/coupon">
          Купон
        </NuxtLink>
      </li>
      <!-- 
      {#if profile}
        <li aria-current={$page.url.pathname === `/${locale}/p/${profile.userName}` ? 'page' : undefined}>
          <a href='/{locale}/p/{profile.userName}'>{t.header.menu.profile}</a>
        </li>
      {/if} -->
    </ul>
  </nav>

  <div class="right">
    <div class="items">
      <Profile />
    </div>
  </div>
</template>

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

  li[aria-current='page'] a {
    color: var(--green-9);
  }
</style>