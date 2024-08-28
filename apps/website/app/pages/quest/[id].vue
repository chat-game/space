<template>
  <section class="hero">
    <h1>{{ quest?.name }}</h1>
    <h2>
      Задание, созданное <a :href="`/p/${quest?.profile.userName}`">{{ quest?.profile.userName }}</a>
    </h2>
  </section>

  <section class="info-block">
    <div class="quest-block">
      <div class="info">
        <p class="description">
          {{ quest?.description }}
        </p>

        <div class="rewards-block">
          <p>Награда:</p>
          <div class="rewards">
            <div class="reward">
              <img src="/trophies/default/64.png" alt="" width="28" height="28">
              Трофей
            </div>
          </div>
        </div>

        <div v-if="profileEdition?.completedAt" class="completed">
          Выполнено: {{ useLocaleTimeAgo(new Date(profileEdition.completedAt)) }}
        </div>
      </div>
      <div class="completion">
        <div>
          <p class="points">
            {{ quest?.points }}
          </p>
          <p>Очков "Странника"</p>
        </div>
      </div>
    </div>
  </section>

  <section class="progress">
    <h2 class="title">
      Кто выполнил это задание
    </h2>
    <p class="desc">
      Показаны последние профили
    </p>

    <div class="block">
      <div v-for="edition in quest?.editions" :key="edition.id" class="card">
        <div>
          <img src="/units/twitchy/128.png" alt="" width="64" height="64">
        </div>
        <div>
          <a :href="`/p/${edition.profile.userName}`">{{ edition.profile.userName }}</a>
        </div>
        <time v-if="edition.completedAt">
          {{ useLocaleTimeAgo(new Date(edition.completedAt)) }}
        </time>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    const { error } = await useFetch(`/api/quest/${route.params.id}`)
    return error.value === undefined
  },
})

const route = useRoute()
const { data: quest } = await useFetch(`/api/quest/${route.params.id}`)

const { user } = useUserSession()
const profileEdition = quest.value?.editions.find((e) => e.profileId === user.value?.id)
</script>

<style scoped>
  .info-block {
    padding-top: 0;

    .quest-block {
      background-color: #ffefd6;
      border: 2px solid var(--color-border);
      display: grid;
      grid-template-columns: 2fr 1fr;
      margin-bottom: 0.5em;

      .info {
        position: relative;
        padding: 1em 1em;

        .description {
          font-size: 0.9rem;
        }
      }

      .completed {
        margin-top: 0.5em;
        color: var(--brown-8);
      }

      .completion {
        position: relative;
        padding: 0.5em 1em;
        color: var(--brown-10);
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 0.5em;

        .points {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.2;
        }
      }

      .rewards-block {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 0.75em;
        margin-top: 0.75em;

        .rewards {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 0.5em;

          .reward {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            gap: 0.5em;
            font-size: 0.9rem;
            color: var(--orange-11)
          }
        }
      }
    }
  }

  .progress {
    padding-top: 2em;
    padding-bottom: 4em;
    max-width: 64em;

    .title {
      margin-bottom: 0.25em;
    }

    .desc {
      margin-bottom: 1em;
    }

    .block {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5em;

      @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (min-width: 1200px) {
        grid-template-columns: repeat(6, 1fr);
      }

      .card {
        background-color: var(--color-background-2);
        border: 2px solid var(--color-border-2);
        padding: 1em;

        time {
          font-size: 0.8rem;
        }
      }
    }
  }
</style>
