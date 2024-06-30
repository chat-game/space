<script lang='ts'>
  import { page } from '$app/stores'
  import twitchIcon from '$lib/assets/website/icons/twitch/112.png'
  import { config } from '$lib/config'

  const url = new URL('https://id.twitch.tv/oauth2/authorize')
  url.searchParams.set('client_id', config.twitch.clientId)
  url.searchParams.set('redirect_uri', config.signInRedirectUrl)
  url.searchParams.set('response_type', 'token')
  url.searchParams.set('scope', 'chat:read channel:read:redemptions')

  const isSignedIn = !!$page.data.profile

  const handleSignOut = () => {
    void fetch('/auth/profile', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    }).finally(() => location.assign('/'))
  }

  let menuOpened = false

  const handleMenuClick = () => {
    menuOpened = !menuOpened
  }

  const onfocusout = ({ relatedTarget, currentTarget }: { relatedTarget: EventTarget | null, currentTarget: HTMLElement }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) {
      return
    }

    menuOpened = false
  }
</script>

<div class='wrapper' {onfocusout}>
  {#if isSignedIn}
    <button class='profile-avatar' onclick={handleMenuClick}>
      <img src={twitchIcon} alt="" />
    </button>
    {#if menuOpened}
      <div class='dropdown-menu position-left'>
        <a href='/{$page.data.locale}/p/{$page.data.profile.userName}'>Профиль</a>
        <a href='/{$page.data.locale}/play'>Играть</a>
        <button onclick={handleSignOut}>Выйти</button>
      </div>
    {/if}
  {:else}
    <a class='twitch' href={url.href}>Войти</a>
  {/if}
</div>

<style>
    .wrapper {
        position: relative;
        width: fit-content;
        margin-left: auto;
    }

    .twitch {
      color: white;
      text-decoration: none;
        padding: 0.5em 1.2em;
        background-color: var(--color-twitch);
        transition: all 0.2s;
    }

    .twitch:hover {
      text-decoration: none;
        transform: scale(1.04);
        opacity: 0.8;
    }

    .profile-avatar {
        padding: 4px;
        width: 58px;
        height: 58px;
        background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
        border: 2px solid var(--color-border);
        transition: all 0.2s;
    }

    .profile-avatar:hover {
        opacity: 0.8;
    }

    .profile-avatar img {
        width: 100%;
        height: auto;
    }

    .position-left {
      right: 0;
    }
</style>
