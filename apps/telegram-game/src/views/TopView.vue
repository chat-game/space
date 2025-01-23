<template>
  <PageContainer>
    <div v-if="leaderboard?.title">
      <SectionHeader :text="t('top.players')" />

      <div class="tg-section-bg mb-4 px-3 py-3 rounded-2xl">
        <div class="flex flex-row gap-2 items-center">
          <Image src="woodland-small.png" class="w-12 h-12" />
          <div>
            <h3 class="text-xl font-medium">
              {{ t(`leaderboards.${leaderboard.id}.title`) }}
            </h3>
            <div v-if="leaderboard?.finishedAt">
              {{ t('availableUntil') }} {{ new Date(leaderboard.finishedAt).toLocaleString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </div>
          </div>
        </div>

        <p class="mt-1 tg-hint text-sm leading-tight">
          {{ t(`leaderboards.${leaderboard.id}.description`) }}
        </p>

        <div v-if="profileInLeaderboard" class="z-30 fixed bottom-24 left-4 right-4 border tg-border tg-section-bg px-3 pt-3 pb-4 rounded-t-2xl">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-row gap-3 items-center">
              <p class="font-medium text-lg">
                {{ profileInLeaderboard.position }}
              </p>
              <p class="font-medium text-lg">
                {{ t('top.myResult') }}
              </p>
            </div>
            <div class="flex flex-row gap-1 items-center text-lg">
              {{ profileInLeaderboard.points }} <Image src="woodland-small.png" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div v-for="member in leaderboard?.members" :key="member.id" class="px-3 py-2 tg-section-bg rounded-2xl flex flex-row gap-2 justify-between">
          <div class="flex flex-row gap-3 items-center">
            <div v-if="member.position === 1">
              <Image :src="getTrophyImage({ rarity: 3 })" class="w-10 h-10" />
            </div>
            <div v-else-if="member.position === 2">
              <Image :src="getTrophyImage({ rarity: 1 })" class="w-8 h-8" />
            </div>
            <div v-else-if="member.position === 3">
              <Image :src="getTrophyImage({ rarity: 0 })" class="w-6 h-6" />
            </div>
            <p v-else class="font-medium text-lg">
              {{ member.position }}
            </p>

            <p class="font-medium text-lg">
              {{ member.profile.telegramProfile?.firstName }}
            </p>
          </div>
          <div class="flex flex-row gap-1 items-center text-lg">
            {{ member.points }} <Image src="woodland-small.png" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <div>
      <SectionHeader :text="t('item.trophy.titleMine')" />

      <div v-if="trophies.length" class="grid grid-cols-3 gap-2">
        <ActiveCard v-for="edition in trophies" :key="edition.id" class="px-2 flex flex-col flex-wrap gap-2 items-center" @click="selectTrophy(edition.id)">
          <Image :src="getTrophyImage(edition.trophy)" class="w-full h-auto" />
          <p class="w-full text-center text-sm font-medium leading-4 line-clamp-2">
            {{ edition.trophy.name }}
          </p>
        </ActiveCard>
      </div>
      <div v-else class="tg-section-bg p-3 flex flex-col gap-2 items-center rounded-2xl">
        <p class="font-medium tg-hint">
          {{ t('item.trophy.empty') }}
        </p>
      </div>
    </div>
  </PageContainer>

  <Modal :title="selectedTrophy?.trophy.name ?? ''" :is-opened="isTrophyOpened" @close="isTrophyOpened = false">
    <p v-if="selectedTrophy?.createdAt" class="tg-hint font-medium leading-tight">
      {{ t('item.trophy.obtained') }} {{ new Date(selectedTrophy.createdAt).toLocaleString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) }}
    </p>

    <p class="tg-hint text-sm leading-tight">
      {{ selectedTrophy?.trophy.description ?? '' }}
    </p>
  </Modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const { profile } = useTelegramProfile()
const { leaderboard, refreshLeaderboard } = useLeaderboard()

onMounted(() => {
  refreshLeaderboard()
})

const profileInLeaderboard = computed(() => leaderboard.value?.members.find((m) => m.profileId === profile.value?.profile.id))

const trophies = computed(() => profile.value?.profile.trophyEditions || [])

const isTrophyOpened = ref(false)
const selectedTrophyId = ref<string>()
const selectedTrophy = computed(() => trophies.value?.find(({ id }) => id === selectedTrophyId.value))

function selectTrophy(id: string) {
  isTrophyOpened.value = true
  selectedTrophyId.value = id
}

function getTrophyImage(data: { rarity: number, id?: string, hasImage?: boolean }): string {
  if (!data.hasImage) {
    switch (data.rarity) {
      case 0:
        return 'trophies/common/128.png'
      case 1:
        return 'trophies/uncommon/128.png'
      case 2:
        return 'trophies/rare/128.png'
      case 3:
        return 'trophies/epic/128.png'
      case 4:
        return 'trophies/legendary/128.png'
      default:
        return 'trophies/common/128.png'
    }
  }

  return `trophies/${data.id}/128.png`
}
</script>
