<template>
  <ClientOnly>
    <div class="w-dvw h-dvh overflow-hidden">
      <div
        id="game-canvas"
        ref="stage"
        class="absolute bottom-0 w-full h-[200px] overflow-hidden"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { GameAddon } from '@chat-game/addon'

definePageMeta({
  layout: 'game',
})

const route = useRoute()
const id = route.query.id?.toString() ?? ''
const eventsUrl = computed(() => `/api/charge/${id}/sse`)

const stage = ref<HTMLElement>()

onMounted(async () => {
  const addon = new GameAddon({ id, eventsUrl: eventsUrl.value })
  await addon.init()
  stage.value?.appendChild(addon.app.canvas)

  return () => addon.destroy()
})
</script>
