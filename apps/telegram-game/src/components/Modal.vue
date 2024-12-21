<template>
  <div
    class="z-40 left-0 right-0 top-0 bottom-0 tg-secondary-bg opacity-0 transition-all duration-500"
    :class="{ 'fixed! block! opacity-70': isOpened, 'opacity-0!': isClosing }"
  />

  <div v-if="$slots.bg && isOpened && !isClosing">
    <slot name="bg" />
  </div>

  <div
    class="z-40 flex flex-col justify-end fixed left-0 right-0 bottom-0 mx-auto w-full max-w-lg max-h-[100dvh] overflow-y-auto p-4 m-0 pb-20 shadow-none translate-y-full transition-transform duration-500"
    :class="{ 'top-0! translate-y-0!': isOpened, 'translate-y-full!': isClosing }"
  >
    <div ref="target" class="relative mb-10 p-4 md:p-6 lg:p-8 space-y-3 tg-section-bg tg-text rounded-2xl shadow-lg max-h-[70dvh] overflow-y-auto !overflow-visible">
      <h3 class="text-xl md:text-2xl font-medium leading-tight">
        {{ title }}
      </h3>

      <slot />

      <Button @click="onClose()">
        Закрыть
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, usePointerSwipe } from '@vueuse/core'

const { isOpened } = defineProps<{
  isOpened: boolean
  title: string
}>()

const emit = defineEmits(['close'])
const isClosing = ref(false)
const target = ref(null)

onClickOutside(target, () => isOpened && onClose())
const { isSwiping, direction } = usePointerSwipe(target)

watch(isSwiping, () => {
  if (direction.value === 'down') {
    onClose()
  }
})

function onClose() {
  isClosing.value = true
  setTimeout(() => {
    emit('close')
    isClosing.value = false
  }, 500)
}
</script>
