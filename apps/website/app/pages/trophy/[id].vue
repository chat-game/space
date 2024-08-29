<template>
  <section class="hero">
    <h1>{{ trophy?.name }}</h1>
    <h2>
      Трофей, созданный <NuxtLink :to="localePath(`/p/${trophy?.profile.userName}`)">
        {{ trophy?.profile.userName }}
      </NuxtLink>
    </h2>
  </section>

  <section class="trophies">
    <div class="trophy-block">
      <div class="info">
        <p class="description">
          {{ trophy?.description }}
        </p>
      </div>
      <div class="completion">
        <div class="trophy">
          <img src="/trophies/default/64.png" alt="" width="64" height="64">
        </div>
        <div>
          <p class="points">
            {{ trophy?.points }}
          </p>
          <p>Очков</p>
        </div>
      </div>
    </div>
  </section>

  <section class="progress">
    <h2 class="title">
      Кто получил этот трофей
    </h2>
    <p class="desc">
      Показаны последние профили, которые получили этот трофей.
    </p>

    <div class="block">
      <div v-for="progress in latestProfiles" :key="progress.id" class="card">
        <div>
          <img src="/units/twitchy/128.png" alt="" width="64" height="64">
        </div>
        <div>
          <NuxtLink :to="localePath(`/p/${progress.profile.userName}`)">
            {{ progress.profile.userName }}
          </NuxtLink>
        </div>
        <time>{{ useLocaleTimeAgo(new Date(progress.createdAt)) }}</time>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    const { error } = await useFetch(`/api/trophy/${route.params.id}`)
    return error.value === undefined
  },
})

const localePath = useLocalePath()
const route = useRoute()
const { data: trophy } = await useFetch(`/api/trophy/${route.params.id}`)
const latestProfiles = trophy.value?.editions.slice(0, 12)
</script>

<style scoped>
  .trophy-block {
    background-color: #ffefd6;
    border: 2px solid var(--color-border);
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin-bottom: 0.5em;
  }

  .trophy-block .info {
    position: relative;
    padding: 1em 1em;
  }

  .trophy-block .info .description {
    font-size: 0.9rem;
  }

  .trophy-block .completion {
    position: relative;
    padding: 0.5em 1em;
    color: #f76b15;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
  }

  .trophy-block .completion .points {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .trophy-block .completion .trophy {
    opacity: 1;
  }

  .progress {
    padding-top: 2em;
    padding-bottom: 4em;
    max-width: 64em;
  }

  .progress .title {
    margin-bottom: 0.25em;
  }

  .progress .desc {
    margin-bottom: 1em;
  }

  .progress .block {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5em;
  }

  @media (min-width: 768px) {
    .progress .block {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1200px) {
    .progress .block {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  .progress .block .card {
    background-color: var(--color-background-2);
    border: 2px solid var(--color-border-2);
    padding: 1em;
  }

  .progress .block .card time {
    font-size: 0.8rem;
  }
</style>
