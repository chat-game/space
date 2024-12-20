<template>
  <main>
    <Confetti />
    <Game />
    <RouterView />
  </main>
  <Navigation />
</template>

<script setup lang="ts">
useBackButton()
useTelegramProfile()
</script>
