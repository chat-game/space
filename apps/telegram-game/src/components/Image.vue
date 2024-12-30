<template>
  <img :src="src" alt="">
</template>

<script setup lang="ts">
defineProps<{ src: string }>()
</script>
