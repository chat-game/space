<script>
    import {GITHUB_REPO_URL} from "$lib/config";
</script>

<footer>
    <p>Создается с трепетом и ❤️</p>
    <a href={GITHUB_REPO_URL} target="_blank" class="github-link">Код на GitHub</a>
</footer>

<style>
    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
    }

    footer a {
        font-weight: bold;
    }

    @media (min-width: 480px) {
        footer {
            padding: 12px 0;
        }
    }

    .github-link {
        color: var(--color-github);
    }
</style>