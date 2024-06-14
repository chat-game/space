<script lang="ts">
import Clock3 from "lucide-svelte/icons/clock-3"
import Map from "lucide-svelte/icons/map"

export let limitSeconds: number | undefined

const minutes = limitSeconds ? Math.round(limitSeconds / 60) : null
</script>

<div class="block">
  <div class="condition">
    <Clock3 />
    up to {minutes} minutes
  </div>
  <div class="condition">
    <Map />
    Common locations
  </div>
</div>

<style>
  .block {
    margin-top: 0.75em;
    display: flex;
    flex-direction: row;
    gap: 1.5em;
    justify-content: center;
  }

  .condition {
    display: flex;
    flex-direction: row;
    gap: 0.375em;
  }
</style>