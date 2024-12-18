<template>
  <h2 class="mb-2 tg-section-header-text text-2xl">
    {{ text }}
  </h2>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>
