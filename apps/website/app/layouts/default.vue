<template>
  <div class="app" :class="{ overflow: !isFeedOpened }">
    <div class="content">
      <ActiveStreamBanner />
      <MainHeader />

      <main class="pt-18">
        <slot />
      </main>
      <MainFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import '~/assets/css/website.css'

const { isFeedOpened } = useApp()
</script>

<style scoped>
  .app {
    position: relative;
    display: flex;
    flex-direction: row;
    min-height: 100vh;

    &.overflow {
      overflow: hidden;
    }

    .content {
      position: relative;
      flex-grow: 1;
      flex-basis: 0;
      width: 80vw;
    }
  }
</style>
