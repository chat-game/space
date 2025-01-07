<template>
  {{ character?.level }} / {{ character?.xp }} / {{ character?.xpToNextLevel }}
</template>

<script setup lang="ts">
const { character } = useCharacter()
</script>
