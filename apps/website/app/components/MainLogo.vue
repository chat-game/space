<template>
  <ClientOnly>
    <div v-if="$route.path === localePath('/')" class="logo">
      <img :src="randomCharImage" alt="" class="static-index">
    </div>
    <NuxtLink v-else :to="localePath('/')" class="logo">
      <img :src="randomCharImage" alt="" class="static">
      <img :src="randomCharAnimatedImage" alt="" class="animated">
    </NuxtLink>
  </ClientOnly>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

const characters = [
  'shape',
  'gentleman',
  'banana',
  'burger',
  'catchy',
  'marshmallow',
  'twitchy',
  'wooly',
  'pup',
]
const randomChar = characters[Math.floor(Math.random() * characters.length)]
const randomCharImage = `/units/${randomChar}/128.png`
const randomCharAnimatedImage = `/units/${randomChar}/idle.gif`
</script>

<style scoped>
.logo {
  width: 64px;
  height: 64px;
  margin-top: -22px;
  transition: all 0.2s;
  scale: 1.2;

  .static-index {
    display: block;
    width: 64px;
    height: 64px;
  }

  .static {
    display: block;
    width: 64px;
    height: 64px;
  }

  .animated {
    display: none;
    width: 64px;
    height: 64px;
  }

  &:hover {
    scale: 1.3;

    .static {
      display: none;
    }

    .animated {
      display: block;
    }
  }
}
</style>
