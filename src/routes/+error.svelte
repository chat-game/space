<script lang='ts'>
  import { page } from '$app/stores'

  const t = $page.data.t
</script>

<div class='block'>
  <h2>{t?.error.title} ({$page.status})</h2>
  <h3>{t?.error[$page.status]}</h3>
</div>

<style>
    .block {
        text-align: center;
    }
</style>
