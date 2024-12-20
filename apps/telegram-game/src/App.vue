<template>
  <main>
    <Confetti />
    <Game />
    <RouterView />
  </main>
  <Navigation />
</template>

<script setup lang="ts">
import { initData } from '@telegram-apps/sdk-vue'

useBackButton()
const { refreshProfile, updateUserData } = useTelegramProfile()

onMounted(() => {
  const user = initData.user()

  if (user) {
    updateUserData({ userId: user.id, username: user?.username })
    refreshProfile()
  }
})
</script>
