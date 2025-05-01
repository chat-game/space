<template>
  <PageContainer>
    <Image
      :id="id"
      :src="`units/${character?.codename}/idle.gif`"
      class="-mb-2 w-40 h-40"
    />

    <div class="tg-section-bg px-3 py-3 rounded-2xl space-y-3">
      <h3 class="text-xl md:text-2xl font-medium leading-tight">
        {{ `&laquo;${t(`characters.${character?.id}.nickname`)}&raquo; ${t(`characters.${character?.id}.name`)}` }}
      </h3>

      <p class="text-sm tg-hint leading-tight">
        {{ t(`characters.${character?.id}.description`) }}
      </p>

      <CharacterUnlockBlock :character-id="character?.id ?? ''" />
    </div>

    <div>
      <SectionHeader :text="t('character.reward.title')" />

      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="level in character?.levels"
          :key="level.id"
          @click="selectItem(level.inventoryItem.id)"
        >
          <InventoryItemCard
            v-if="level.inventoryItemId"
            :item-id="level.inventoryItemId"
            :amount="level.awardAmount"
            class="!px-4 !pt-2 mb-1.5 w-full h-18"
          />
          <div class="text-center text-sm">
            <p>{{ level.level }} {{ t('character.level') }}</p>
          </div>
        </div>
      </div>
    </div>

    <Modal
      :title="selectedItemId ? t(`items.${selectedItemId}.name`) : ''"
      :is-opened="isItemOpened"
      @close="isItemOpened = false"
    >
      <p v-if="selectedItemId" class="tg-hint text-sm leading-tight">
        {{ t(`items.${selectedItemId}.description`) }}
      </p>
    </Modal>

    <ConfettiBackground />
  </PageContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const query = router.currentRoute.value.query
const characterId = computed(() => query?.id)

const { characters } = useCharacters()
const character = computed(() => characters.value?.find(({ id }) => id === characterId.value))

const isItemOpened = ref(false)
const selectedItemId = ref<string>()

function selectItem(id: string) {
  isItemOpened.value = true
  selectedItemId.value = id
}

const id = useId()

onMounted(() => {
  // Scroll to top
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
})
</script>
