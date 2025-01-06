<template>
  <section class="hero max-w-4xl">
    <div class="header-block">
      <h1 class="text-lg md:text-2xl lg:text-3xl">
        {{ pageProfile?.userName }}
      </h1>

      <div class="currency-block">
        <div v-if="pageProfile?.mana && pageProfile.mana > 0" class="currency">
          <div class="counter">
            {{ pageProfile.mana }}
          </div>
          <img src="~/assets/img/icons/mana/64.png" alt="" width="48" height="48">
        </div>

        <div v-if="pageProfile?.coins && pageProfile.coins > 0" class="currency">
          <div class="counter">
            {{ pageProfile.coins }}
          </div>
          <img src="~/assets/img/icons/coin/64.png" alt="" width="48" height="48">
        </div>

        <div v-if="pageProfile?.coupons && pageProfile.coupons > 0" class="currency">
          <div class="counter">
            {{ pageProfile.coupons }}
          </div>
          <img src="~/assets/img/icons/coupon/64.png" alt="" width="48" height="48">
        </div>
      </div>
    </div>
    <h2>Профиль игрока <span class="profile-lvl">{{ pageProfile?.level }} уровня</span></h2>

    <div class="unit-avatar">
      <img :src="`/units/${activeCharacter?.character.codename}/idle.gif`" alt="" class="game-canvas" width="256" height="256">
    </div>

    <div class="active-character">
      <div>
        Активный Персонаж: {{ activeCharacter?.character.nickname }}
      </div>
      <div class="level">
        {{ activeCharacter?.level }} уровень <span class="xp">{{ activeCharacter?.xp }} опыта</span>
      </div>
    </div>
  </section>

  <section class="titles-block max-w-4xl mx-auto text-center">
    <div class="element">
      <div class="flex flex-row justify-center text-orange-900/35">
        <BookOpenCheck :size="48" />
      </div>
      <p class="title">
        Коллекционер
      </p>
      <div class="points">
        {{ pageProfile?.collectorPoints }} {{ pluralizationRu(pageProfile?.collectorPoints ?? 0, ['очко', 'очка', 'очков']) }}
      </div>
    </div>

    <div class="element">
      <div class="flex flex-row justify-center text-orange-900/35">
        <BookCopy :size="48" />
      </div>
      <p class="title">
        Рассказчик
      </p>
      <div class="points">
        {{ pageProfile?.storytellerPoints }} {{ pluralizationRu(pageProfile?.storytellerPoints ?? 0, ['очко', 'очка', 'очков']) }}
      </div>
    </div>

    <div class="element">
      <div class="flex flex-row justify-center text-orange-900/35">
        <ShieldQuestion :size="48" />
      </div>
      <p class="title">
        Странник
      </p>
      <div class="points">
        {{ pageProfile?.rangerPoints }} {{ pluralizationRu(pageProfile?.rangerPoints ?? 0, ['очко', 'очка', 'очков']) }}
      </div>
    </div>

    <div class="element">
      <div class="flex flex-row justify-center text-orange-900/35">
        <Trophy :size="48" />
      </div>
      <p class="title">
        Охотник за трофеями
      </p>
      <div class="points">
        {{ pageProfile?.trophyHunterPoints }} {{ pluralizationRu(pageProfile?.trophyHunterPoints ?? 0, ['очко', 'очка', 'очков']) }}
      </div>
    </div>

    <div class="element">
      <div class="flex flex-row justify-center text-orange-900/35">
        <Handshake :size="48" />
      </div>
      <p class="title">
        Меценат
      </p>
      <div class="points">
        {{ pageProfile?.patronPoints }} {{ pluralizationRu(pageProfile?.patronPoints ?? 0, ['очко', 'очка', 'очков']) }}
      </div>
    </div>
  </section>

  <section class="characters max-w-4xl mx-auto text-center">
    <h2 class="text-lg md:text-xl lg:text-2xl">
      Разблокированные персонажи
    </h2>

    <div class="collection-block">
      <div v-for="char in pageProfile?.characterEditions" :key="char.id" class="cell" :class="{ active: char.id === activeCharacter?.id }">
        <div class="flex flex-col justify-center items-center gap-2">
          <img :src="`/units/${char.character.codename}/128.png`" alt="" class="avatar static">
          <img :src="`/units/${char.character.codename}/idle.gif`" alt="" class="avatar animated">
          <div>
            <p class="nickname">
              {{ char.character.nickname }}
            </p>
            <div class="level">
              {{ char.level }} уровень
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="trophies bg-orange-800/5">
    <h2 class="text-lg md:text-xl lg:text-2xl">
      Полученные трофеи
    </h2>

    <p v-if="!trophies?.length" class="empty">
      Пока нет
    </p>

    <div class="collection-block">
      <div v-for="trophyEdition in trophies" :key="trophyEdition.id" class="cell" :data-rarity="trophyEdition.trophy.rarity">
        <div class="py-1 flex flex-col justify-center items-center gap-0.5">
          <img src="/trophies/default/64.png" alt="" width="64" height="64">
          <div class="name">
            {{ trophyEdition.trophy.name }}
          </div>
          <div class="points">
            {{ trophyEdition.trophy.points }} очков
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="levels max-w-4xl py-8 mx-auto text-center">
    <h2 class="text-lg md:text-xl lg:text-2xl">
      Прокачка уровня профиля
    </h2>
    <p>Развивая титулы "Коллекционер", "Рассказчик", "Странник", "Охотник за трофеями", "Меценат" ты получаешь очки. При накоплении очков профиль получает новый уровень.</p>

    <div class="progress">
      Текущий прогресс: {{ pageProfile?.points }} очков
    </div>
  </section>

  <div class="profile-id">
    {{ pageProfile?.id }}
  </div>
</template>

<script setup lang="ts">
import { BookCopy, BookOpenCheck, Handshake, ShieldQuestion, Trophy } from 'lucide-vue-next'

definePageMeta({
  validate: async (route) => {
    const { error } = await useFetch(`/api/profile/userName/${route.params.username}`)
    return error.value === undefined
  },
})

const route = useRoute()
const { data: pageProfile } = await useFetch(`/api/profile/userName/${route.params.username}`)
const { data: trophies } = await useFetch(`/api/trophy/profileId/${pageProfile.value?.id}`)

const activeCharacter = pageProfile.value?.characterEditions?.find((c) => c.id === pageProfile.value?.activeEditionId)
</script>

<style scoped>
  .header-block {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75em;
    margin-bottom: 0.5em;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 0.25em;
      margin-bottom: 1em;
    }

    h1 {
      margin: 0;
    }

    .currency-block {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }
  }

  .profile-lvl {
    color: var(--color-common);
  }

  .currency {
    position: relative;
    display: inline-block;

    .counter {
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      color: var(--brown-1);
      font-weight: 700;
      font-size: 0.8rem;
      background: var(--brown-11);
      padding: 0 0.4em;
      border-radius: 6px;
    }
  }

  .unit-avatar {
    position: relative;
    overflow: visible;
    width: 14em;
    height: 14em;
    margin: 2em auto 0;
    background-image: url(~/assets/img/background-green.webp);
    border: 4px solid var(--color-border);
    border-radius: 8px;

    .game-canvas {
      position: relative;
      padding: 1em 0 0 2em;
    }

    @media screen and (max-width: 768px) {
      .game-canvas {
        padding: 0.75em 0 0 1em;
        width: 100%;
        height: 100%;
      }
    }
  }

  .active-character {
    margin-top: 2.5em;

    .level {
      font-size: 0.9rem;
      margin-top: 0.25em;
      color: var(--bronze-9);

      .xp {
        margin-left: 0.5em;
        color: var(--color-common);
      }
    }
  }

  .titles-block {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 1em;
    max-width: 48em;

    @media (min-width: 768px) {
      & {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .title {
      line-height: 1.2;
    }

    .points {
      color: var(--color-common);
      margin-top: 0.5em;
      font-size: 0.8rem;
    }
  }

  .profile-id {
    font-size: 0.8rem;
    opacity: 0.3;
    margin-top: 2em;
    text-align: center;
  }

  .trophies {
    text-align: center;
    margin: 0 auto;
    padding-top: 3em;
    padding-bottom: 3em;
    max-width: none;

    h2 {
      margin-bottom: 0.5em;
    }

    .empty {
      color: var(--bronze-9);
    }

    .collection-block {
      max-width: 64em;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5em;

      @media (min-width: 375px) {
        & {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width: 620px) {
        & {
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75em;
        }
      }

      @media (min-width: 768px) {
        & {
          grid-template-columns: repeat(6, 1fr);
        }
      }

      @media (min-width: 1024px) {
        & {
          grid-template-columns: repeat(8, 1fr);
        }
      }

      .cell {
        position: relative;
        aspect-ratio: 1 / 1;
        transition: all 0.2s ease-out;
        border-radius: 8px;

        &[data-rarity='0'] {
          background: var(--gray-4);
          border: 3px solid var(--gray-8);
          color: var(--gray-11);
        }

        &[data-rarity='1'] {
          background: var(--green-4);
          border: 3px solid var(--green-7);
          color: var(--green-11);
        }

        &[data-rarity='2'] {
          background: var(--blue-4);
          border: 3px solid var(--blue-7);
          color: var(--blue-11);
        }

        &[data-rarity='3'] {
          background: var(--purple-4);
          border: 3px solid var(--purple-7);
          color: var(--purple-11);
        }

        &[data-rarity='4'] {
          background: var(--orange-4);
          border: 3px solid var(--orange-7);
          color: var(--orange-11);
        }

        img {
          width: 32px;
          height: 32px;
          margin-bottom: 0.5em;
        }

        &:hover {
          transform: translateY(-0.25em);
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

        .name {
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1;
          min-height: 2.25em;
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: start;
        }

        .points {
          margin-top: 0.35em;
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 1;
        }
      }
    }
  }

  .levels {
    margin-top: 1em;

    ul {
      text-align: left;

      li {
        margin-bottom: 0.5em;
      }
    }

    h2 {
      margin-bottom: 0.25em;
    }

    .progress {
      margin-top: 1em;
      padding: 1em;
      font-size: 1.1rem;
      background-color: var(--orange-3);
      border: 2px solid var(--color-border);
      border-radius: 8px;
    }
  }

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
        & {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width: 620px) {
        & {
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75em;
        }
      }

      @media (min-width: 768px) {
        & {
          grid-template-columns: repeat(6, 1fr);
        }
      }

      @media (min-width: 1024px) {
        & {
          grid-template-columns: repeat(8, 1fr);
        }
      }

      .cell {
        position: relative;
        aspect-ratio: 1 / 1;
        transition: all 0.2s ease-out;
        background: var(--orange-3);
        border: 3px solid var(--color-border);
        border-radius: 8px;

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

        &.active {
          background: var(--green-3);
          border: 3px solid var(--green-7);

          .nickname, .level {
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

        .nickname, .level {
          color: var(--brown-11);
        }

        .nickname {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .level {
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 1;
        }
      }
    }
  }
</style>
