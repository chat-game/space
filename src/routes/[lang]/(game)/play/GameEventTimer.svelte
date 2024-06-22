<script lang='ts'>
  import { onDestroy } from 'svelte'

  const { endsAt }: { endsAt: Date } = $props()

  const countdown = new Date(endsAt).getTime()
  let now = Date.now()
  const end = now + countdown

  const count = $state(Math.round((end - now) / 1000))
  const h = $state(Math.floor(count / 3600))
  const m = $state(Math.floor((count - h * 3600) / 60))
  const s = $state(count - h * 3600 - m * 60)

  function updateTimer() {
    now = Date.now()
  }

  const interval = setInterval(updateTimer, 1000)
  if (count === 0) {
    clearInterval(interval)
  }

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<div class='block'>
  Ends in {h}:{m}:{s}
</div>

<style>
  .block {
    margin-top: 0.5em;
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-style: italic;
  }
</style>
