<template>
  <img :src="getAssetUrl(src)" alt="">
</template>

<script setup lang="ts">
defineProps<{ src: string }>()

function getAssetUrl(path: string): string {
  return new URL(`chatgame-assets/${path}`, 'https://storage.yandexcloud.net').href
}
</script>
