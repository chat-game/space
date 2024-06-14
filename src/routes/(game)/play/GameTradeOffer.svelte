<script lang="ts">
import type { ITradeOffer } from "$lib/game/types"
import GameItem from "./GameItem.svelte"

export let offer: ITradeOffer
</script>

<div class="block">
  <div class="type">
    {#if offer.type === "BUY"}
      Buying
    {:else if offer.type === "SELL"}
      Selling
    {/if}
  </div>

  <div class="info">
    <div class="item">
      <GameItem type={offer.item}/>
      <p>1 for {offer.unitPrice}</p>
      <GameItem type="COIN"/>
    </div>

    <div class="amount">{offer.amount} units left</div>

    <div class="command">
      <p>
        Write a command to the chat:
      </p>
      <p>
        {offer.commandToTrade} [quantity]
      </p>
    </div>
  </div>
</div>

<style>
  .block {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .type {
    margin-bottom: 0.5em;
  }

  .info {
    padding: 0.5em;
  }

  .info .item {
    display: flex;
    flex-direction: row;
    gap: 0.25em;
    align-items: center;
  }

  .info .item p {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .info .amount {
    font-style: italic;
  }

  .info .command {
    margin-top: 0.5em;
  }
</style>