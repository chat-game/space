<template>
  <div class="flex flex-col justify-center items-center size-8 rounded-md" :class="getEffectColor(modifier.code)">
    <p class="text-sm font-semibold">
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
    return 'bg-rose-300'
  }
  return 'bg-orange-200'
}
</script>
