<script lang="ts">
import Fuel from "lucide-svelte/icons/fuel"
import Gauge from "lucide-svelte/icons/gauge"

export let speedPerSecond = 0
export let fuel = 0

const fuelInSeconds = Math.round(fuel / 40)
const fuelInMinutes = Math.round(fuelInSeconds / 60)

const showSpeed = `${speedPerSecond} m/sec`
const showFuelTime =
  fuelInSeconds > 0
    ? fuelInMinutes < 1
      ? `${fuelInSeconds} sec`
      : `≈ ${fuelInMinutes} min`
    : "[no fuel!]"
</script>

<div class="block">
  <div class="item-block">
    <Gauge />
    <p>{showSpeed}</p>
  </div>
  <div class="item-block">
    <Fuel />
    <p>{showFuelTime}</p>
  </div>
</div>

<style>
  .block {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1.5em;
    align-items: center;
  }

  .item-block {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.5em;
    align-items: center;
    font-weight: 700;
    text-align: center;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
</style>