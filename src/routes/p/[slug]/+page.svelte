<script lang="ts">
import type { PageServerData } from "./$types"

export let data: PageServerData
</script>

<section class="hero">
    <h1>{data.profile.userName}</h1>
    <h2>Профиль игрока</h2>
</section>

<style>
    .hero {
        padding-top: 4em;
        padding-bottom: 4em;
        max-width: 64em;
    }

    h1 {
        margin-bottom: 0.25em;
    }

    section {
        text-align: center;
        padding: 2em 1em;
        margin: 0 auto;
        max-width: 42em;
    }
</style>