<script lang="ts">
  import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>

<div>Мы уже чиним, ждите</div>