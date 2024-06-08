<script>
    import {DONATE_URL, GITHUB_REPO_URL} from "$lib/config";
</script>

<footer>
    <p>Создается с трепетом и ❤️</p>

    <ul>
        <li>
            <a href={GITHUB_REPO_URL} target="_blank">Код на GitHub</a>
        </li>
        <li>
            <a href={DONATE_URL} target="_blank">Донат</a>
        </li>
    </ul>
</footer>

<style>
    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
        margin-top: 4em;
    }

    a {
        font-weight: bold;
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
        margin: 0.6em 0 1.5em;
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
        padding: 0 0.5em;
        opacity: 0.2;
    }
</style>