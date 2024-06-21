<script lang='ts'>
  import ThumbsUp from 'lucide-svelte/icons/thumbs-up'
  import GameCommand from './GameCommand.svelte'
  import type { IGamePoll } from '$lib/game/types'

  export let poll: IGamePoll

  let pollProgressBarWidth = Math.round(
    poll.votes.length / (poll.votesToSuccess / 100),
  )
  if (pollProgressBarWidth > 100) {
    pollProgressBarWidth = 100
  }
</script>

<div class='info'>
  <div class='progress'>
    Votes: {poll.votes.length} of {poll.votesToSuccess}
  </div>
  <div class='bar' style='width: {pollProgressBarWidth}%'></div>
</div>

<GameCommand command={poll.action.commandDescription} />

<div class='votes'>
  {#each poll.votes as vote}
    <div class='vote'>
      <ThumbsUp />
      <span>{vote.userName}</span>
    </div>
  {/each}
</div>

<style>
  .info {
    position: relative;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    width: 100%;
    height: fit-content;
    min-height: 2em;
  }

  .info .progress {
    position: relative;
    z-index: 2;
    width: 100%;
    height: fit-content;
    padding-left: 0.25em;
    padding-right: 0.25em;
    font-size: 1.125rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.25em;
    align-items: center;
    justify-content: center;
    line-height: 1.25;
  }

  .info .bar {
    z-index: 1;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    background-color: var(--color-accent-1);
  }

  .votes {
    margin-top: 0.5em;
    margin-bottom: 0.25em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5em;
  }

  .votes .vote {
    padding: 0.25em 0.75em;
    display: flex;
    flex-direction: row;
    gap: 0.25em;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
</style>
