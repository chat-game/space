<script>
import {
  DISCORD_SERVER_INVITE_URL,
  DONATE_URL,
  GITHUB_REPO_URL,
  TWITCH_URL,
} from "$lib/config"
</script>

<footer>
    <ul>
        <li>
            <a href={GITHUB_REPO_URL} target="_blank">Код на GitHub</a>
        </li>
        <li>
            <a href={DISCORD_SERVER_INVITE_URL} target="_blank">Discord</a>
        </li>
        <li>
            <a href={TWITCH_URL} target="_blank">Twitch</a>
        </li>
        <li>
            <a href={DONATE_URL} target="_blank">Донат</a>
        </li>
    </ul>

    <p>Создается с трепетом и ❤️</p>
</footer>

<style>
    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
        margin-top: 4em;
        margin-bottom: 2em;
    }

    a {
        font-weight: 600;
        color: var(--color-text);
    }

    a:hover {
        color: var(--color-accent-1);
    }

    @media (min-width: 480px) {
        footer {
            padding: 0.5em 0;
        }
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0 0 0.8em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
    }

    li {
        position: relative;
        display: flex;
        gap: 0;
        height: 100%;
    }

    li:not(:last-child):after {
        content: "|";
        font-size: 0.8rem;
        padding: 0 0.5em;
        opacity: 0.3;
    }
</style>