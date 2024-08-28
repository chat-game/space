<template>
  <section class="hero">
    <h1>Задания</h1>
    <h2>Столько всего можно сделать...</h2>
  </section>

  <section v-if="questsForProfile" class="quests-block">
    <a v-for="quest in questsForProfile" :key="quest.id" :href="localePath(`/quest/${quest.id}`)">
      <div class="quest">
        <div class="info">
          <p class="name">{{ quest.name }}</p>
          <p class="description">{{ quest.description }}</p>

          <div class="rewards-block">
            <p>Награда:</p>
            <div class="rewards">
              <div class="reward">
                <img src="/trophies/default/64.png" alt="" width="28" height="28">
                Трофей
              </div>
            </div>
          </div>
        </div>
        <div class="completion">
          <div class="trophy" />
          <div>
            <p class="points">{{ quest.points }}</p>
            <p>Очков</p>
          </div>
        </div>
      </div>
    </a>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const { user } = useUserSession()
const { data: questsForProfile } = await useFetch(`/api/quest/profileId/${user.value?.id}`)
</script>

<style scoped>
  .quests-block {
    padding-top: 0;

    a {
      text-decoration: none;
      color: inherit;
    }

    .quest {
      background: var(--orange-3);
      border: 3px solid var(--color-border);
      color: var(--brown-11);
      display: grid;
      grid-template-columns: 2fr 1fr;
      margin-bottom: 0.5em;
      transition: all 0.2s ease-out;

      &:hover {
        transform: scale(0.98);
      }

      .info {
        position: relative;
        padding: 0.5em 1em;

        .name {
          font-weight: 600;
          font-size: 1.1rem;
          opacity: 0.8;
        }

        .description {
          font-size: 0.9rem;
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

      .completion {
        position: relative;
        padding: 0.5em 1em;
        color: var(--brown-11);
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

        .trophy {
          opacity: 1;
        }
      }
    }
  }
</style>
