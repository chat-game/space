<template>
  <div class="wrapper">
    <button
      v-if="loggedIn"
      class="profile-avatar"
      @click="handleMenuClick"
    >
      <img :src="user?.imageUrl ?? defaultImage" alt="">
    </button>
    <a v-else class="twitch" href="/api/auth/twitch">Войти</a>
  </div>
</template>

<script setup lang="ts">
const { isFeedOpened } = useApp()
const { loggedIn, user } = useUserSession()
const { public: publicEnv } = useRuntimeConfig()

function handleMenuClick() {
  isFeedOpened.value = !isFeedOpened.value
}

const defaultImage = `${publicEnv.cdnUrl}/icons/twitch/112.png`
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
    animation-name: skewRandom;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    animation-direction: alternate-reverse;
    transform-origin: 50% 50%;
    scale: 1.1;
    opacity: 0.9;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 50%;
  }
}

@keyframes skewRandom {
  0% {
    transform: skewX(0);
  }
  50% {
    transform: skewX(-3deg);
  }
  75% {
    transform: skewX(3deg);
  }
  100% {
    transform: skewX(0);
  }
}
</style>
