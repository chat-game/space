<script lang="ts">
  import { page } from "$app/stores"
</script>

<h1>{$page.status}: {$page.error?.message}</h1>

<p>Ну вот... Или это фича?</p>

<style>
    p {
        margin-top: 1em;
        text-align: center;
    }
</style>