<template>
  <ClientOnly>
    <div v-if="$route.path === '/'" class="logo" :style="{ backgroundImage: randomCharUrl }" />
    <NuxtLink v-else :to="localePath('/')">
      <div class="logo shake" :style="{ backgroundImage: randomCharUrl }" />
    </NuxtLink>
  </ClientOnly>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

const characters = [
  'banana',
  'burger',
  'catchy',
  'claw',
  'marshmallow',
  'sharky',
  'twitchy',
  'wooly',
  'woody',
  'pup',
]
const randomChar = characters[Math.floor(Math.random() * characters.length)]
const randomCharUrl = `url(/units/${randomChar}/128.png)`
</script>

<style scoped>
header {
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;

  @media (max-width: 768px) {
    & {
      padding: 0.5em 0.5em;
    }
  }
}

.left {
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  align-items: center;

  a {
    font-size: 0;
  }
}

@keyframes skewRandom {
  0% {
    transform: skewX(0);
  }
  50% {
    transform: skewX(-3deg);
  }
  75% {
    transform: skewX(3deg);
  }
  100% {
    transform: skewX(0);
  }
}

.logo {
  width: 64px;
  height: 64px;
  margin-top: -14px;
  transition: all 0.2s;
  background-size: contain;
  scale: 1.2;

  &:hover.shake {
    animation-name: skewRandom;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    animation-direction: alternate-reverse;
    transform-origin: 50% 50%;
    scale: 1.1;
  }
}
</style>
