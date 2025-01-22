<template>
  <Modal :title="t('character.reward.title')" :is-opened="isOpened" @close="emit('close')">
    <div class="max-w-full overflow-x-scroll snap-x">
      <div class="w-max flex flex-row flex-wrap gap-2">
        <div v-for="level in preparedLevels" :id="currentLevel && currentLevel === level.level ? id : undefined" :key="level.id" class="mb-2 scroll-ml-6 snap-start">
          <InventoryItemCard v-if="level.inventoryItemId" :item-id="level.inventoryItemId" :amount="level.awardAmount" class="!px-4 !pt-2 mb-1.5 w-24 h-18 bg-gradient-to-br from-sky-50 to-blue-200" :class="{ '!grayscale !opacity-50': currentLevel && currentLevel < level.level }" />
          <div class="text-center text-sm">
            <p v-if="currentLevel && currentLevel >= level.level">
              {{ t('character.reward.received') }}
            </p>
            <p v-else>
              {{ level.level }} {{ t('character.level') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import type { CharacterLevelWithItem } from '@chat-game/types'
import { useI18n } from 'vue-i18n'

const { levels, currentLevel, isOpened } = defineProps<{ isOpened: boolean, levels: CharacterLevelWithItem[], currentLevel?: number }>()

const emit = defineEmits(['close'])

const { t } = useI18n()

const preparedLevels = computed(() => levels.toSorted((a, b) => a.level - b.level))

const id = useId()

function scrollToCurrentLevel() {
  const currentLevelElement = document.getElementById(id)
  if (currentLevelElement) {
    currentLevelElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
  }
}

onMounted(() => {
  scrollToCurrentLevel()
})

watch(() => isOpened, () => {
  scrollToCurrentLevel()
})
</script>
