<template>
  <a v-if="isStreaming" href="https://twitch.tv/hmbanan666" target="_blank">
    <div class="streaming-banner">
      <div class="message">hmbanan666 сейчас стримит. Присоединяйся к движу. Не забудь забрать купон!</div>
    </div>
  </a>
</template>

<script setup lang="ts">
const { data: services } = await useFetch('/api/twitch/status')
const isStreaming = computed(() => services.value?.some((s) => s.service === 'HMBANAN666_TWITCH' && s.status === 'RUNNING'))
</script>

<style scoped>
a {
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
}

.streaming-banner {
  width: 100%;
  min-height: 4em;
  padding: 0.5em 0.5em;
  background-color: var(--violet-9);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s all;

  &:hover {
    opacity: 0.85;
    padding: 1.75em 0.5em;
  }

  .message {
    color: var(--violet-1);
    text-align: center;
  }
}
</style>
