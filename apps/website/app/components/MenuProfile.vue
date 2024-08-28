<template>
  <div class="wrapper">
    <button
      v-if="loggedIn"
      class="profile-avatar"
      @click="handleMenuClick"
    >
      <img :src="user?.imageUrl ?? '/icons/twitch/112.png'" alt="">
    </button>
    <a v-else class="twitch" href="/api/auth/twitch">Войти</a>
  </div>
</template>

<script setup lang="ts">
const { isFeedOpened } = useApp()
const { loggedIn, user } = useUserSession()

function handleMenuClick() {
  isFeedOpened.value = !isFeedOpened.value
}
</script>

<style scoped>
.wrapper {
  position: relative;
  width: fit-content;
  display: inline-block;
}

.twitch {
  color: white;
  text-decoration: none;
  padding: 0.5em 1.2em;
  background-color: var(--violet-9);
  transition: all 0.2s;

  &:hover {
    text-decoration: none;
    transform: scale(1.04);
    opacity: 0.8;
  }
}

.profile-avatar {
  width: 58px;
  height: 58px;
  background-color: var(--bronze-4);
  border: 2px solid var(--bronze-6);
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 50%;
  }
}
</style>
