<template>
  <main class="bg font-serif absolute top-0 bottom-0 left-0 right-0 px-4 py-2 flex flex-col">
    <slot />
  </main>
</template>

<style scoped>
.bg {
  background-color: var(--tg-theme-secondary-bg-color);
}
</style>
