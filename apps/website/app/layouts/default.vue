<template>
  <ActiveStreamBanner />
  <MainHeader />

  <main class="pt-18">
    <slot />
  </main>
  <MainFooter />
</template>

<script setup lang="ts">
import '~/assets/css/website.css'
</script>
