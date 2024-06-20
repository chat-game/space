<script>
  import { locale, locales, t } from '$lib/translations'

  const handleChange = ({ currentTarget }) => {
    const { value } = currentTarget

    document.cookie = `lang=${value} ;`
  }
</script>

<div>
  <select bind:value={$locale} on:change={handleChange}>
    {#each $locales as value}
      <option value={value} selected={$locale === value}>{$t(`lang.${value}`)}</option>
    {/each}
  </select>
</div>
