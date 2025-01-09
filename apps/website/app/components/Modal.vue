<template>
  <div
    class="z-40 left-0 right-0 top-0 bottom-0 bg-neutral-950 opacity-0 transition-all duration-500"
    :class="{ 'fixed! block! opacity-60': isOpened, 'opacity-0!': isClosing }"
  />

  <div v-if="$slots.bg && isOpened && !isClosing">
    <slot name="bg" />
  </div>

  <div
    class="z-40 flex flex-col justify-end fixed left-0 right-0 bottom-0 mx-auto w-full max-w-xl max-h-[100dvh] overflow-y-hidden p-4 m-0 pb-16 shadow-none translate-y-full transition-transform duration-500"
    :class="{ 'top-0! translate-y-0!': isOpened, 'translate-y-full!': isClosing }"
  >
    <div ref="target" class="relative p-4 md:p-6 bg-orange-100 rounded-xl shadow-lg">
      <div class="pb-20 max-h-[75dvh] !overflow-y-auto !overflow-hidden space-y-3">
        <h3 class="text-xl md:text-2xl font-medium leading-tight">
          {{ title }}
        </h3>

        <slot />
      </div>

      <div class="z-50 absolute bottom-0 right-0 left-0 bg-orange-100 rounded-xl px-4 md:px-6 pt-2 pb-4">
        <Button @click="onClose()">
          Закрыть
        </Button>
      </div>
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
