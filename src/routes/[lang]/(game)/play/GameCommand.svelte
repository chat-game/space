<script lang='ts'>
  export let command: string
</script>

<div class='block'>
  {command}
</div>

<style>
  .block {
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    text-align: center;
    background-color: var(--color-twitch);
    color: var(--color-background);
  }
</style>
