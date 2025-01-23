<template>
  <PageContainer>
    <Image :src="`units/${character?.codename}/idle.gif`" class="-mb-2 w-40 h-40" />

    <div class="tg-section-bg px-3 py-3 rounded-2xl space-y-3">
      <h3 class="text-xl md:text-2xl font-medium leading-tight">
        {{ `&laquo;${t(`characters.${character?.id}.nickname`)}&raquo; ${t(`characters.${character?.id}.name`)}` }}
      </h3>

      <p class="text-sm tg-hint leading-tight">
        {{ t(`characters.${character?.id}.description`) }}
      </p>
    </div>

    <div>
      <SectionHeader :text="t('character.reward.title')" />

      <div class="max-w-full overflow-x-scroll snap-x">
        <div class="w-max flex flex-row flex-wrap gap-2">
          <div v-for="level in character?.levels" :key="level.id" class="mb-2 scroll-ml-6 snap-start">
            <InventoryItemCard v-if="level.inventoryItemId" :item-id="level.inventoryItemId" :amount="level.awardAmount" class="!px-4 !pt-2 mb-1.5 w-24 h-18" />
            <div class="text-center text-sm">
              <p>{{ level.level }} {{ t('character.level') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
</script>
