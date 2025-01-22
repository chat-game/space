<template>
  <main>
    <Game />
    <RouterView />
  </main>
  <Navigation />
</template>

<script setup lang="ts">
import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import { useI18n } from 'vue-i18n'

useBackButton()
const { refreshProfile } = useTelegramProfile()

const i18n = useI18n({ useScope: 'global' })

function setLocale(languageCode: string | undefined) {
  if (!languageCode) {
    i18n.locale.value = 'en'
    return
  }

  if (languageCode === 'ru') {
    i18n.locale.value = languageCode
    return
  }

  i18n.locale.value = 'en'
}

onMounted(() => {
  const { initDataRaw, initData } = retrieveLaunchParams()

  if (initDataRaw) {
    refreshProfile()
    setLocale(initData?.user?.languageCode)
  }
})
</script>
