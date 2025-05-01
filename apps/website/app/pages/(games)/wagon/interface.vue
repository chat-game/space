<template>
  <ClientOnly>
    <div class="relative w-dvw h-dvh overscroll-none overflow-hidden">
      <div class="absolute bottom-16 left-0 py-2 px-1.5 w-46 bg-orange-950 rounded-r-xl">
        <img
          src="/qr-website.png"
          alt="qr"
          class="relative"
        >
      </div>

      <div class="absolute bottom-10 left-0 right-0 h-1.5 bg-orange-900">
        <div
          class="absolute top-0 left-0 h-full bg-orange-300 transition-all duration-1000 ease-out overflow-visible"
          :style="{ width: `${chargeLevel > 100 ? 100 : chargeLevel}%` }"
        >
          <div class="absolute inset-0 bg-orange-100 opacity-10 animate-pulse" />

          <div class="absolute -right-1 -bottom-2.25 w-8 h-6 z-10 px-2 py-0.5 bg-gradient-to-b from-orange-900 to-orange-950 border-b-2 border-orange-900 rounded-full" :class="{ '!from-orange-50 !to-orange-100': changeRateInMinute > 0 }">
            <Icon name="lucide:zap" class="!size-4 text-orange-400 animate-pulse" />
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-10 bg-orange-950">
        <div class="flex flex-row gap-3 justify-between items-center h-full py-2 px-4">
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex flex-row items-center px-2 bg-gradient-to-b from-orange-200 to-orange-300 rounded-xl">
              <Icon :name="batteryIconName" class="!size-6 text-orange-950" />
            </div>

            <h2 class="text-lg font-bold text-orange-200">
              Заряженность
            </h2>
          </div>

          <div class="grow flex flex-row justify-between items-center gap-3">
            <NumberFlow
              :value="chargeLevel / 100"
              :format="{ style: 'percent', maximumFractionDigits: 1 }"
              locales="en-US"
              class="text-xl font-bold"
              :class="chargeTextColor"
            />
            <NumberFlow
              :value="changeRateInMinute / 100"
              locales="en-US"
              suffix=" в минуту"
              :format="{ style: 'percent', maximumFractionDigits: 2, signDisplay: 'always' }"
              class="text-sm transition-colors duration-300"
              :class="[
                changeRateInMinute < 0 ? 'text-orange-600' : 'text-orange-300',
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import NumberFlow from '@number-flow/vue'

definePageMeta({
  layout: 'game',
})

const route = useRoute()

const energy = ref(56)
const changeRate = ref(-100)

const chargeLevel = computed(() => energy.value)
const changeRateInSecond = computed(() => changeRate.value / 1000)
const changeRateInMinute = computed(() => changeRateInSecond.value * 60)

const lastUpdate = ref(Date.now())
let decayInterval: NodeJS.Timeout

const chargeTextColor = computed(() => {
  if (chargeLevel.value > 80) {
    return 'text-orange-100'
  }
  if (chargeLevel.value > 60) {
    return 'text-orange-200'
  }
  if (chargeLevel.value > 30) {
    return 'text-orange-300'
  }
  if (chargeLevel.value > 10) {
    return 'text-orange-400'
  }
  return 'text-orange-500'
})

const batteryIconName = computed(() => {
  if (chargeLevel.value < 10) {
    return 'i-lucide-battery'
  }
  if (chargeLevel.value < 30) {
    return 'i-lucide-battery-low'
  }
  if (chargeLevel.value < 80) {
    return 'i-lucide-battery-medium'
  }
  return 'i-lucide-battery-full'
})

onMounted(() => {
  const energyNow = route.query.energy?.toString() ?? energy.value
  if (energyNow) {
    energy.value = Number(energyNow)
  }

  const changeRateNow = route.query.rate?.toString() ?? changeRate.value
  if (changeRateNow) {
    changeRate.value = Number(changeRateNow)
  }

  decayInterval = setInterval(() => {
    const now = Date.now()
    const deltaSeconds = (now - lastUpdate.value) / 1000
    lastUpdate.value = now

    energy.value = Math.max(0, Math.min(1000, energy.value + (changeRateInSecond.value * deltaSeconds)))
  }, 1000)
})

onUnmounted(() => {
  clearInterval(decayInterval)
})
</script>
