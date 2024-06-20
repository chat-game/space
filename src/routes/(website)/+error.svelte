<script lang='ts'>
  import { page } from '$app/stores'
  import { t } from '$lib/translations'
</script>

<h1>{$t('error.title')} ({$page.status})</h1>

<p>{$t(`error.${$page.status}`, { default: $t('error.default') })}</p>

<style>
    p {
        margin-top: 1em;
        text-align: center;
    }
</style>
