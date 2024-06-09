<script>
    import {page} from "$app/stores";
    import {env} from '$env/dynamic/public';
    import twitchIcon from "$lib/assets/website/twitch-112.png"

    let url = new URL("https://id.twitch.tv/oauth2/authorize")
    url.searchParams.set("client_id", env.PUBLIC_TWITCH_CLIENT_ID)
    url.searchParams.set("redirect_uri", env.PUBLIC_SIGNIN_REDIRECT_URL)
    url.searchParams.set("response_type", "token")
    url.searchParams.set("scope", "chat:read channel:read:redemptions")

    let isSignedIn = !!$page.data.profile

    const handleSignOut = () => {
        void fetch('/auth/profile', {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            },
        }).finally(() => location.assign("/"))
    }

    let menuOpened = false

    const handleMenuClick = () => {
        menuOpened = !menuOpened
    }
</script>

<div class="wrapper">
    {#if isSignedIn}
        <button class="profile-avatar" on:click={handleMenuClick}>
            <img src={twitchIcon} alt=""/>
        </button>
        {#if menuOpened}
            <div class="profile-menu">
                <div>{$page.data.profile.userName}</div>
                <button on:click={handleSignOut}>Выйти</button>
            </div>
        {/if}
    {:else}
        <button class="twitch">
            <a href={url.href}>Войти</a>
        </button>
    {/if}
</div>

<style>
    .wrapper {
        position: relative;
        width: fit-content;
        margin-left: auto;
    }

    .twitch {
        padding: 0.5em 1.2em;
        color: white;
        background-color: var(--color-twitch);
        transition: all 0.2s;
    }

    .twitch:hover {
        transform: scale(1.04);
        opacity: 0.8;
    }

    a {
        color: white;
        text-decoration: none;
    }

    a:hover {
        text-decoration: none;
    }

    .profile-avatar {
        padding: 4px;
        width: 58px;
        height: 58px;
        background-image: linear-gradient(58.2deg, rgba(40, 91, 212, 0.73) -3%, rgba(171, 53, 163, 0.45) 49.3%, rgba(255, 204, 112, 0.37) 97.7%);
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

    .profile-menu {
        position: absolute;
        top: calc(58px + 4px);
        right: 0;
        padding: 4px 8px;
        background-color: var(--color-background);
        border: 2px solid var(--color-border);
    }
</style>
