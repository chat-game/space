<template>
  <section class="hero">
    <h1>Игровые персонажи</h1>
    <h2>Игроки "прокачивают" персонажей, путем написания постов. Это могут быть истории или новая информация о характере и судьбе.</h2>

    <div class="currency-block">
      <div class="currency">
        <img src="~/assets/img/icons/coin/128.png" alt="" width="64" height="64">
        <div class="right">
          <div v-if="loggedIn">
            <p class="counter">
              {{ profile?.coins }}
            </p>
            <p class="description">
              {{ pluralizationRu(profile?.coins ?? 0, [
                'Монета',
                'Монеты',
                'Монет',
              ]) }}
            </p>
          </div>

          <p v-else class="description">
            Войди на сайт
          </p>
        </div>
      </div>

      <a href="/shop">Купить монеты</a>
    </div>
  </section>

  <section class="characters">
    <h2>Коллекция персонажей 2024</h2>

    <div class="collection-block">
      <div
        v-for="char in readyCharacters"
        :key="char.id"
        :data-owned="!!char.editions.find(e => e.profileId === profile?.id)"
        :class="{ active: !!char.editions.find(e => e.id === profile?.activeEditionId) }"
        class="cell"
      >
        <a :href="`/character/${char.id}`">
          <img :src="`/units/${char.codename}/128.png`" alt="" class="avatar static">
          <img :src="`/units/${char.codename}/idle.gif`" alt="" class="avatar animated">
          <p class="nickname">{{ char.nickname }}</p>
          <div class="level">{{ char.editions.find(e => e.profileId === profile?.id)?.level }} уровень</div>

          <div v-if="char.price > 0" class="price">
            <img src="~/assets/img/icons/coin/32.png" alt="" width="18" height="18"> {{ char.price }}
          </div>
        </a>
      </div>
    </div>
  </section>

  <section class="characters">
    <h2>Персонажи, требующие доработки</h2>

    <div class="collection-block">
      <div v-for="char in notReadyCharacters" :key="char.id" class="cell" :data-owned="!!char.editions.find(e => e.profileId === profile?.id)">
        <a :href="`/character/${char.id}`">
          <p class="nickname">{{ char.nickname }}</p>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { loggedIn, user } = useUserSession()
const { data: profile } = await useFetch(`/api/profile/userName/${user.value?.userName}`)
const { data: characters } = await useFetch('/api/character')
const readyCharacters = characters.value?.filter((c) => c.isReady)
const notReadyCharacters = characters.value?.filter((c) => !c.isReady)
</script>

<style>
  .characters {
    text-align: center;
    margin: 0 auto;
    padding-top: 2em;
    padding-bottom: 4em;
    max-width: 64em;

    h2 {
      margin-bottom: 1em;
    }

    .collection-block {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5em;

      @media (min-width: 375px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: 620px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75em;
      }

      @media (min-width: 768px) {
        grid-template-columns: repeat(6, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(8, 1fr);
      }

      .cell {
        position: relative;
        aspect-ratio: 1 / 1;
        transition: all 0.2s ease-out;

        .avatar {
          width: 64px;
          height: 64px;
        }

        .static {
          display: block;
        }

        .animated {
          display: none;
          width: 68px;
          height: 68px;
        }

        &[data-owned='false'] {
          background: var(--gray-6);
          border: 3px solid var(--gray-8);

          .avatar {
            filter: grayscale(1);
          }

          .nickname {
            color: var(--gray-11);
          }

          .level {
            display: none;
          }
        }

        &[data-owned='true'] {
          background: var(--orange-3);
          border: 3px solid var(--color-border);

          .avatar {
            filter: grayscale(0);
          }

          .nickname, .level, .price {
            color: var(--brown-11);
          }

          .price {
            display: none;
          }
        }

        &.active {
          background: var(--green-3);
          border: 3px solid var(--green-7);

          .nickname, .level, .price {
            color: var(--green-11);
          }
        }

        &:hover {
          transform: translateY(-0.25em);
          opacity: 0.85;

          .static {
            display: none;
          }

          .animated {
            display: block;
          }
        }

        a {
          text-decoration: none;
          color: inherit;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .nickname {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .price {
          position: absolute;
          top: 4px;
          left: 4px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25em;
          margin-top: 0;

          img {
            filter: grayscale(1);
          }
        }

        .level {
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 1;
        }
      }
    }
  }

  .currency-block {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    margin-top: 2em;
    background-color: var(--teal-2);
    background: linear-gradient(130deg, var(--teal-4) 0%, var(--teal-2) 100%);
    border: 3px solid var(--teal-6);
    padding: 1em;

    .currency {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 0.75em;

      .right {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: flex-start;
        justify-content: center;

        .counter {
          font-size: 1.8rem;
          font-weight: 600;
          line-height: 1.2;
          color: var(--teal-11);
          text-align: left;
        }

        .description {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--teal-10);
        }
      }
    }

    a {
      padding: 0.75em 1.5em;
      border: 3px solid var(--bronze-5);
      background-color: var(--green-9);
      background: linear-gradient(130deg, var(--teal-9) 0%, var(--green-8) 100%);
      color: var(--teal-2);
      font-weight: 600;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9;
        text-decoration: none;
        scale: 1.03;
      }
    }
  }
</style>
