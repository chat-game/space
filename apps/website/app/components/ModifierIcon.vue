<template>
  <div class="flex flex-col justify-center items-center size-8 rounded-md" :class="getEffectColor(modifier.code)">
    <Icon :name="getEffectIcon(modifier.code)" class="!shrink-0 !size-5 text-orange-950" />
    <p class="-mt-0.75 text-xs">
      {{ seconds }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ChargeModifier } from '~~/types/charge'

const { modifier } = defineProps<{
  modifier: ChargeModifier
}>()

const seconds = computed(() => Math.round(Math.abs(modifier.expiredAt - Date.now()) / 1000))

function getEffectColor(code: string) {
  if (code.startsWith('positive')) {
    return 'bg-orange-200'
  }
  if (code.startsWith('negative')) {
    return 'bg-orange-500'
  }
  return 'bg-orange-200'
}

function getEffectIcon(code: string) {
  if (code.startsWith('positive1') || code.startsWith('negative1')) {
    return 'lucide:dice-1'
  }
  if (code.startsWith('positive2') || code.startsWith('negative2')) {
    return 'lucide:dice-2'
  }
  if (code.startsWith('positive3') || code.startsWith('negative3')) {
    return 'lucide:dice-3'
  }
}
</script>
