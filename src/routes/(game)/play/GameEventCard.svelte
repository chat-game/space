<script lang='ts'>
  import GameEventTimer from './GameEventTimer.svelte'
  import GamePollProgress from './GamePollProgress.svelte'
  import GameQuestConditions from './GameQuestConditions.svelte'
  import GameQuestTask from './GameQuestTask.svelte'
  import GameTradeOffer from './GameTradeOffer.svelte'
  import type { IGameEvent } from '$lib/game/services/event/interface'

  export let event: IGameEvent
  const isActive = event.status === 'STARTED'

  function getCardLabelByType(type: IGameEvent['type']) {
    if (type === 'MAIN_QUEST_STARTED') {
      return 'main quest'
    }
    if (type === 'SIDE_QUEST_STARTED') {
      return 'side quest'
    }
    if (type === 'TRADE_STARTED') {
      return 'trade in the village'
    }
    if (type === 'VOTING_FOR_NEW_MAIN_QUEST_STARTED') {
      return 'poll'
    }
    if (type === 'IDEA_CREATED') {
      return 'idea'
    }
  }

  const label = getCardLabelByType(event.type)
</script>

<div class='block' data-active={isActive}>
  <div class='header'>
    <p class='title'>{event.title}</p>
    <p class='label'>{label}</p>
  </div>
  <div class='body'>
    <p class='description'>{event.description}</p>

    {#if event.poll}
      <GamePollProgress poll={event.poll} />
    {/if}

    {#if event.quest}
      <GameQuestConditions limitSeconds={event.quest.conditions.limitSeconds} />
    {/if}

    {#if event.quest}
      {#each event.quest.tasks as task}
        <GameQuestTask task={task} />
      {/each}
    {/if}

    {#if event.offers}
      <GameTradeOffer offer={event.offers[0]} />
    {/if}

    <GameEventTimer endsAt={event.endsAt} />
  </div>
</div>

<style>
  .block {
    position: relative;
    width: 100%;
    height: auto;
    border-style: solid;
    border-width: 3px;
    border-color: var(--color-border);
    transform: translateX(100%);
    transition-duration: 500ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .block[data-active=true] {
    transform: translateX(0);
  }

  .header {
    background-color: var(--color-bg-accent-1);
    padding: 1em;
  }

  .header .title {
    font-weight: 700;
    font-size: 1.25rem;
    text-align: center;
    line-height: 1.25;
    color: var(--color-background);
  }

  .header .label {
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--color-background);
  }

  .body {
    padding: 1em;
    background-color: var(--color-background);
  }

  .body .description {
    margin-bottom: 0.5em;
    font-weight: 500;
    line-height: 1.25;
  }
</style>
