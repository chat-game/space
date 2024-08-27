<template>
  <footer>
    <ul>
      <li v-for="link in links" :key="link.url">
        <NuxtLink :to="link.url" :target="link.isOnNewTab && '_blank'">
          {{ link.title }}
        </NuxtLink>
      </li>
    </ul>

    <p class="copyright">
      Создается с ❤️ и трепетом. &copy; 2024 ChatGame
    </p>
  </footer>
</template>

<script setup lang="ts">
const links = [
  {
    title: 'Boosty',
    url: 'https://boosty.to/hmbanan666',
    isOnNewTab: true,
  },
  {
    title: 'Discord',
    url: 'https://discord.gg/B6etUajrGZ',
    isOnNewTab: true,
  },
  {
    title: 'Twitch',
    url: 'https://www.twitch.tv/hmbanan666',
    isOnNewTab: true,
  },
  {
    title: 'Об игре',
    url: '/about',
  },
  {
    title: 'Купить Монеты',
    url: '/shop',
  },
  {
    title: 'Оферта',
    url: '/docs/offer',
  },
]
</script>

<style scoped>
  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1em;
    margin-top: 4em;
    margin-bottom: 2em;

    @media (min-width: 480px) {
      & {
        padding: 0.5em 0;
      }
    }
  }

  a {
    font-weight: 600;
    color: inherit;
    transition: 0.2s all;

    &:hover {
      color: var(--green-9);
      text-decoration: none;
    }
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0 0 0.8em;
    display: flex;
    gap: 0.75em;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style: none;

    @media screen and (min-width: 620px) {
      flex-direction: row;
      gap: 1.5em;
    }
  }

  li {
    position: relative;
  }

  .copyright {
    color: var(--bronze-9);
    text-align: center;
    margin-top: 0.5em;
  }
</style>
