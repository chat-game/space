<template>
  <ClientOnly>
    <div class="relative w-dvw h-dvh overscroll-none overflow-hidden">
      <div class="absolute bottom-16 left-0 py-2 px-1.5 w-36 bg-orange-950 rounded-r-xl">
        <img
          src="/qr-website.png"
          alt="qr"
          class="relative"
        >
      </div>

      <div class="absolute bottom-10 left-0 right-0 h-1.5 bg-orange-900">
        <div
          class="absolute top-0 left-0 h-full bg-orange-300 transition-all duration-1000 ease-out overflow-visible"
          :style="{ width: `${energy > 100 ? 100 : energy}%` }"
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
              :value="energy / 100"
              :format="{ style: 'percent', maximumFractionDigits: 1 }"
              locales="en-US"
              class="text-xl font-bold"
              :class="chargeTextColor"
            />

            <div class="flex flex-row items-center gap-4">
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

              <NumberFlow
                :value="difficulty"
                locales="en-US"
                prefix="сложность x"
                :format="{ style: 'decimal', maximumFractionDigits: 2 }"
                class="text-sm transition-colors duration-300 text-orange-300"
              />
            </div>
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

const id = route.query.id as string
const energy = ref(0)
const rate = ref(0)
const difficulty = ref(0)

async function update(id: string) {
  const data = await $fetch(`/api/charge/${id}`)
  if (!data) {
    return
  }

  energy.value = data.energy
  rate.value = data.rate
  difficulty.value = data.difficulty
}

const changeRateInSecond = computed(() => rate.value / 1000)
const changeRateInMinute = computed(() => changeRateInSecond.value * 60)

const chargeTextColor = computed(() => {
  if (energy.value > 80) {
    return 'text-orange-100'
  }
  if (energy.value > 60) {
    return 'text-orange-200'
  }
  if (energy.value > 30) {
    return 'text-orange-300'
  }
  if (energy.value > 10) {
    return 'text-orange-400'
  }
  return 'text-orange-500'
})

const batteryIconName = computed(() => {
  if (energy.value < 10) {
    return 'i-lucide-battery'
  }
  if (energy.value < 30) {
    return 'i-lucide-battery-low'
  }
  if (energy.value < 80) {
    return 'i-lucide-battery-medium'
  }
  return 'i-lucide-battery-full'
})

let syncInterval: NodeJS.Timeout

onMounted(() => {
  update(id)

  syncInterval = setInterval(() => {
    update(id)
  }, 4000)
})

onUnmounted(() => {
  clearInterval(syncInterval)
})
</script>
