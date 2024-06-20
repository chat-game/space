<script lang='ts'>
  import { locale, locales, t } from '$lib/translations'

  type SelectEvent = Event & { currentTarget: EventTarget & HTMLInputElement }

  const handleChange = ({ currentTarget }: SelectEvent) => {
    const { value } = currentTarget

    document.cookie = `lang=${value} ;`
  }
</script>

<div>
  <select bind:value={$locale} on:change={() => handleChange}>
    {#each $locales as value}
      <option value={value} selected={$locale === value}>{$t(`lang.${value}`)}</option>
    {/each}
  </select>
</div>
