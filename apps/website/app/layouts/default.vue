<template>
  <div class="app font-serif" :class="{ overflow: !isFeedOpened }">
    <div class="content">
      <ActiveStreamBanner />
      <MainHeader />
      <main>
        <slot />
      </main>
      <MainFooter />
    </div>

    <MainFeed v-if="loggedIn" />
  </div>
</template>

<script setup lang="ts">
import '~/assets/css/website.css'

const { isFeedOpened } = useApp()
const { loggedIn } = useUserSession()
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
