<script lang="ts">
  import { page } from "$app/stores";

  if ($page.url.hash) {
    void fetch('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ hash: $page.url.hash }),
      headers: {
        'content-type': 'application/json',
      },
    }).finally(() => location.assign("/"))
  }
</script>

<section class="hero">
    <h1>Sign In</h1>
    <h2>Wait a moment...</h2>
</section>

<style>
    section {
        text-align: center;
        padding: 2em 1em;
        margin: 0 auto;
        max-width: 42em;
    }

    .hero {
        padding-top: 4em;
        padding-bottom: 4em;
        max-width: 64em;
    }

    h1 {
        width: 100%;
        margin-bottom: 0.25em;
    }
</style>