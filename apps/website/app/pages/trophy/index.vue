<template>
  <section class="hero">
    <h1>Трофеи</h1>
    <h2>Придумываем вместе награды за особые активности на стримах</h2>

    <div class="create-new">
      <a href="/trophy/new">Создать новый <img src="~/assets/img/icons/mana/64.png" alt="" width="32" height="32"></a>
    </div>
  </section>

  <section class="trophies-block">
    <div class="trophies">
      <div v-for="trophy in readyTrophies" :key="trophy.id" class="cell" :data-rarity="trophy.rarity">
        <a :href="`/trophy/${trophy.id}`">
          <img src="/trophies/default/64.png" alt="" width="64" height="64">
          <div class="name">{{ trophy.name }}</div>
          <div class="points">{{ trophy.points }} очков</div>
        </a>
      </div>
    </div>
  </section>

  <section class="trophies-block">
    <h2>Трофеи, требующие доработки</h2>

    <div class="trophies">
      <div v-for="trophy in inWorkTrophies" :key="trophy.id" class="cell" :data-rarity="trophy.rarity">
        <a :href="`/trophy/${trophy.id}`">
          <img src="/trophies/default/64.png" alt="" width="64" height="64">
          <div class="name">{{ trophy.name }}</div>
          <div class="points">{{ trophy.points }} очков</div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: trophies } = await useFetch('/api/trophy/')
const readyTrophies = trophies.value?.filter((t) => t.isReady)
const inWorkTrophies = trophies.value?.filter((t) => !t.isReady)
</script>

<style scoped>
  .create-new {
    position: relative;
    margin-top: 1em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.75em;
      padding: 0.75em 1.5em;
      border: 3px solid var(--bronze-6);
      background-color: var(--orange-9);
      background: linear-gradient(130deg, var(--blue-11) 0%, var(--blue-8) 100%);
      color: var(--orange-2);
      font-weight: 600;
      transition: all 0.2s;

      &:hover {
        text-decoration: none;
        scale: 1.03;
      }
    }
  }

  .trophies-block {
    max-width: 64em;
    margin: 0 auto;

    h2 {
      margin-bottom: 1em;
    }

    .trophies {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5em;

      @media (min-width: 375px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: 620px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75em;
      }

      @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(6, 1fr);
      }
    }

    .cell {
      position: relative;
      aspect-ratio: 1 / 1;
      transition: all 0.2s ease-out;
      padding: 0.5em;

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
        width: 48px;
        height: 48px;
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
        font-size: 1rem;
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
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1;
      }
    }
  }
</style>
