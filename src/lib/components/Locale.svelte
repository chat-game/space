<script lang='ts'>
  import { page } from '$app/stores'
  import { supportedLocales } from '$lib/translations'

  const locale = $page.data.locale
  let selected = locale

  const handleChange = ({ currentTarget }: { currentTarget: HTMLSelectElement }) => {
    const { value } = currentTarget
    window.location.href = `/${value}`
  }
</script>

<select bind:value={selected} onchange={handleChange}>
  {#each supportedLocales as value}
    <option value={value} selected={selected === value}>{value}</option>
  {/each}
</select>

<style>
  select {
    margin: 0 2em;
  }
</style>
