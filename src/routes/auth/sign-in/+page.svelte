<script lang="ts">
  import { page } from "$app/stores";

  if ($page.url.hash) {
    const hash = $page.url.hash.split("#")[1]

    void fetch('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ hash }),
      headers: {
        'content-type': 'application/json',
      },
    }).then(res => res.ok && location.assign("/"))
  }
</script>

<div>
    Sign In
</div>