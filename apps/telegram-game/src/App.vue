<template>
  <main>
    <Game />
    <RouterView />
  </main>
  <Navigation />
</template>

<script setup lang="ts">
import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'

useBackButton()
const { refreshProfile } = useTelegramProfile()

onMounted(() => {
  const { initDataRaw } = retrieveLaunchParams()

  if (initDataRaw) {
    refreshProfile()
  }
})
</script>
