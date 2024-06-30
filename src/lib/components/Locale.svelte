<script lang='ts'>
  import Globe from 'lucide-svelte/icons/globe'
  import { page } from '$app/stores'
  import { type Locale, supportedLocales } from '$lib/translations'

  const dictionary = {
    ru: {
      short: 'Рус',
      long: 'Русский',
    },
    en: {
      short: 'Eng',
      long: 'English',
    },
  }

  const locale = $page.data.locale as Locale

  let isOpened = false

  const onfocusout = ({ relatedTarget, currentTarget }: { relatedTarget: EventTarget | null, currentTarget: HTMLElement }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) {
      return
    }

    isOpened = false
  }
</script>

<div class='block' {onfocusout}>
  <button class='select-lang' onclick={() => isOpened = !isOpened}>
    <div class='icon'>
      <Globe />
    </div>
    <span>{dictionary[locale].short}</span>
  </button>

  {#if isOpened}
    <div class='dropdown'>
      {#each supportedLocales as locale}
        <button onclick={() => window.location.href = `/${locale}`}>{dictionary[locale].long}</button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .block {
    position: relative;
  }

  .select-lang {
    padding: 0.25em 0.35em 0.25em 0.25em;
    background-color: #F6EEE7;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25em;
    cursor: pointer;
    border: 0;
    transition: color 0.2s;
  }

  .select-lang:hover {
    color: var(--color-bg-accent-2)
  }

  .select-lang .icon {
    pointer-events: none;
    height: 24px;
  }

  .dropdown {
    position: absolute;
    top: 2.25em;
    padding: 0.25em 0.25em;
    background-color: #F6EEE7;
  }

  .dropdown button {
    padding: 0.25em 0.25em;
  }

  .dropdown button:hover {
    color: var(--color-accent-1)
  }
</style>
