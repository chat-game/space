<template>
  <div>
    <section class="hero">
      <h1>Интерактивная чат-игра для Twitch</h1>
      <h2>
        Группа игроков сопровождает Машину из точки А в точку Б, не зная, доберутся ли. Зрители
        могут использовать "!команды", которые запускают динамичные действия.
      </h2>
    </section>

    <section>
      <p>
        Стример играет вместе со своей аудиторией. Либо он делает перерыв, пока зрители развлекаются
        или...
      </p>
      <p class="mt-2">
        За все время {{ pluralizationRu(profileCount, ['создан', 'создано', 'создано']) }}
        {{ profileCount }} {{ pluralizationRu(profileCount, ['профиль', 'профиля', 'профилей']) }}.
        Присоединяйся
        <a href="https://twitch.tv/hmbanan666" target="_blank" class="twitch-link">на активном стриме</a>!
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Интерактивная чат-игра для Twitch',
  meta: [
    {
      name: 'description',
      content: 'Стример играет вместе со своей аудиторией. Либо он делает перерыв, пока зрители...',
    },
  ],
})

const { data } = await useFetch('/api/profile')
const profileCount = data.value?.count ?? 0
</script>

<style scoped>
#game-canvas {
  width: 100%;
  height: 28em;
  touch-action: none;
  transition: all 0.2s;
}

#game-canvas[data-active='true'] {
  height: 48em;
}

.game-block {
  position: relative;
  width: 100%;
  margin: 4em 0;
}

.game-block .buttons-block {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.game-block .buttons-block[data-active='false'] {
  visibility: hidden;
}

.buttons-block .show-switch {
  background: var(--color-bg-accent-1);
  color: var(--color-background);
  border: 3px solid var(--color-border);
  padding: 1.5em 2.5em;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.buttons-block button:hover {
  transform: scale(1.05);
}

section {
  text-align: center;
  padding: 2em 1em;
  margin: 0 auto;
  max-width: 42em;
}

.hero {
  padding-top: 4em;
  padding-bottom: 4em;
  max-width: 64em;
}

h1 {
  width: 100%;
  margin-bottom: 0.25em;
}

h2 {
  text-align: center;
}

.twitch-link {
  color: var(--color-twitch);
}

.mt-2 {
  margin-top: 1em;
}
</style>
