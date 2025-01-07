<template>
  <div class="logo -mt-5 -mb-3 -ml-3 -mr-2 w-20 h-20 overflow-hidden">
    <img :src="`/units/${randomChar}/128.png`" alt="" class="static w-20 h-20">
    <img :src="`/units/${randomChar}/idle.gif`" alt="" class="animated w-20 h-20">
  </div>
</template>

<script setup lang="ts">
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
  'telegramo',
  'santa',
]
const randomChar = computed(() => characters[Math.floor(Math.random() * characters.length)])
</script>

<style scoped>
.logo {
  transition: all 0.2s;

  .static-index {
    display: block;
  }

  .static {
    display: block;
  }

  .animated {
    display: none;
  }

  &:hover {
    .static {
      display: none;
    }

    .animated {
      display: block;
    }
  }
}
</style>
