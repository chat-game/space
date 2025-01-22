<template>
  <main>
    <Game />
    <RouterView />
  </main>
  <Navigation />
</template>

<script setup lang="ts">
import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import { setLocale } from './locale'

useBackButton()
const { refreshProfile } = useTelegramProfile()

onMounted(() => {
  const { initDataRaw, initData } = retrieveLaunchParams()

  if (initDataRaw) {
    refreshProfile()
    setLocale(initData?.user?.languageCode)
  }
})
</script>
