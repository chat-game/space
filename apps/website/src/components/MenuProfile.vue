<script setup lang="ts">
const { public: publicEnv } = useRuntimeConfig()
const website = useWebsiteStore()
const isSignedIn = false

const handleMenuClick = () => {
	website.isFeedOpened = !website.isFeedOpened
}

const url = new URL('https://id.twitch.tv/oauth2/authorize')
url.searchParams.set('client_id', publicEnv.twitchClientId)
url.searchParams.set('redirect_uri', publicEnv.signInRedirectUrl)
url.searchParams.set('response_type', 'token')
</script>

<template>
  <div class='wrapper'>
    <button v-if="isSignedIn" class='profile-avatar' @click={handleMenuClick}>
      <img src="~/assets/img/icons/twitch/112.png" alt="" >
    </button>
    <a v-else class='twitch' :href="url.href">Войти</a>
  </div>
</template>

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
    padding: 0.2em;
    width: 58px;
    height: 58px;
    background-color: var(--bronze-4);
    border: 2px solid var(--bronze-6);
    transition: all 0.2s;
    
    &:hover {
      opacity: 0.8;
    }

    img {
      width: 100%;
      height: auto;
    }
  }
</style>