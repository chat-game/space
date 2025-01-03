<template>
  <PageContainer>
    <SectionHeader text="Активное событие" />

    <div class="tg-section-bg mb-1 px-3 py-3 rounded-2xl">
      <div class="flex flex-row gap-2 items-center">
        <Image src="units/santa/head.png" class="w-12 h-12" />
        <div>
          <h3 class="text-xl font-medium">
            {{ leaderboard?.title }}
          </h3>
          <div v-if="leaderboard?.finishedAt">
            Окончание {{ new Date(leaderboard.finishedAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </div>
        </div>
      </div>

      <p class="mt-1 tg-hint text-sm leading-tight">
        {{ leaderboard?.description }}
      </p>

      <div v-if="profileInLeaderboard" class="mt-3 flex flex-row gap-2 justify-between">
        <div class="flex flex-row gap-3 items-center">
          <p class="font-medium text-lg">
            {{ profileInLeaderboard.position }}
          </p>
          <p class="font-medium text-lg">
            Мой результат
          </p>
        </div>
        <div class="flex flex-row gap-1 items-center text-lg">
          {{ profileInLeaderboard.points }} <Image src="items/k3bitdush5wqbwphhdfnxqtl/128.png" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <div class="mb-4 flex flex-col gap-1">
      <div v-for="member in leaderboard?.members" :key="member.id" class="px-3 py-2 tg-section-bg rounded-2xl flex flex-row gap-2 justify-between">
        <div class="flex flex-row gap-3 items-center">
          <p class="font-medium text-lg">
            {{ member.position }}
          </p>
          <p class="font-medium text-lg">
            {{ member.profile.telegramProfile?.firstName }}
          </p>
        </div>
        <div class="flex flex-row gap-1 items-center text-lg">
          {{ member.points }} <Image src="items/k3bitdush5wqbwphhdfnxqtl/128.png" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <SectionHeader text="Мои трофеи" />

    <div v-if="trophies.length" class="grid grid-cols-3 gap-2">
      <ActiveCard v-for="edition in trophies" :key="edition.id" class="flex flex-col gap-2 items-center" @click="selectTrophy(edition.id)">
        <Image :src="getTrophyImage(edition.trophy)" class="w-full h-auto" />
        <p class="text-center text-sm font-medium leading-3 line-clamp-2">
          {{ edition.trophy.name }}
        </p>
      </ActiveCard>
    </div>
    <div v-else class="tg-section-bg mb-4 p-3 flex flex-col gap-2 items-center rounded-2xl">
      <p class="font-medium tg-hint">
        Нет полученных трофеев
      </p>
    </div>
  </PageContainer>

  <Modal :title="selectedTrophy?.trophy.name ?? ''" :is-opened="isTrophyOpened" @close="isTrophyOpened = false">
    <p class="tg-hint text-sm leading-tight">
      {{ selectedTrophy?.trophy.description ?? '' }}
    </p>
    <p v-if="selectedTrophy?.createdAt" class="px-8 tg-hint text-center font-medium leading-tight">
      Получен {{ new Date(selectedTrophy.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }}
    </p>
  </Modal>
</template>

<script setup lang="ts">
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

function getTrophyImage(data: { rarity: number, id: string, hasImage: boolean }): string {
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
