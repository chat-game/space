<script lang="ts">
import { page } from "$app/stores"
import "../../styles.css"

const isAvailable = $page.data.profile?.id === "h149p7n9g7uoggp7ns9k60iv"
</script>

<div class="app">
  {#if isAvailable}
    <slot/>
  {:else}
    <div class="error">Игра пока находится на стадии разработки. <a href="/">Вернуться на Главную</a></div>
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
  }

  .error {
    padding: 2em;
    text-align: center;
  }
</style>