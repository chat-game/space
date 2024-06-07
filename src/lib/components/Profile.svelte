<script>
    import {page} from "$app/stores";
    import {env} from '$env/dynamic/public';
    import {SIGNIN_REDIRECT_URL} from "$lib/config";

    let url = new URL("https://id.twitch.tv/oauth2/authorize")
    url.searchParams.set("client_id", env.PUBLIC_TWITCH_CLIENT_ID)
    url.searchParams.set("redirect_uri", SIGNIN_REDIRECT_URL)
    url.searchParams.set("response_type", "token")
    url.searchParams.set("scope", "chat:read channel:read:redemptions")

    let isSignedIn = !!$page.data.profile
</script>

{#if isSignedIn}
    <div>Привет, {$page.data.profile.userName}!</div>
{:else}
    <a href={url.href}>Войти</a>
{/if}

<style>
    a {
        padding: 0.5em 1.2em;
        color: white;
        background-color: var(--color-twitch);
        text-decoration: none;
    }

    a:hover {
        text-decoration: none;
    }
</style>
