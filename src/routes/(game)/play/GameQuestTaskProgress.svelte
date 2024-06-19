<script lang='ts'>
  import CircleCheck from 'lucide-svelte/icons/circle-check'
  import CircleDashed from 'lucide-svelte/icons/circle-dashed'
  import type { IGameQuestTask } from '$lib/game/services/quest/interface'

  export let task: IGameQuestTask

  let progressBarWidth = Math.round(task.progressNow / (task.progressToSuccess / 100))
  if (progressBarWidth > 100) {
    progressBarWidth = 100
  }
</script>

<div class='block'>
  <div class='task'>
    {#if task.status === 'SUCCESS'}
      <CircleCheck />
    {:else}
      <CircleDashed />
    {/if}
    <p>{task.description}</p>
  </div>

  <div class='progress'>
    <div class='bar' data-active={task.status === 'ACTIVE'} style='width: {progressBarWidth}%'></div>
  </div>
</div>

<style>
  .block {
    position: relative;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    width: 100%;
    height: fit-content;
    min-height: 2em;
  }

  .task {
    position: relative;
    z-index: 2;
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.25em;
    align-items: center;
    line-height: 1.25;
  }

  .progress {
    z-index: 1;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .progress .bar {
    display: none;
    height: 100%;
    background-color: var(--color-background);
  }

  .progress .bar[data-active=true] {
    display: block;
  }
</style>
