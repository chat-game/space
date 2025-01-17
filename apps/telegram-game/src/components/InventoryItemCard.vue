<template>
  <ActiveCard class="!p-2 aspect-square">
    <Image :src="`items/${itemId}/128.png`" class="w-full h-auto" />
    <div class="absolute bottom-0 right-0">
      <p class="mx-auto w-fit px-3 py-1 tg-secondary-bg rounded-tl-2xl rounded-br-2xl leading-none">
        {{ amount }}
      </p>
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
defineProps<{ itemId: string, amount: number }>()
</script>
