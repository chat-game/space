<script lang='ts'>
  import CircleCheck from 'lucide-svelte/icons/circle-check'
  import CircleDashed from 'lucide-svelte/icons/circle-dashed'
  import GameCommand from './GameCommand.svelte'
  import GameQuestTaskProgress from './GameQuestTaskProgress.svelte'
  import type { IGameQuestTask } from '$lib/game/services/quest/interface'

  export let task: IGameQuestTask

  const isBoolean = typeof task.progressToSuccess === 'boolean'
  const isCommand = task.status === 'ACTIVE' && task.action?.commandDescription
</script>

<div class='block'>
  {#if isBoolean}
    <div class='relative w-full h-8 text-primary flex flex-row gap-1 items-center'>
      {#if task.status === 'SUCCESS'}
        <CircleCheck />
      {:else}
        <CircleDashed />
      {/if}
      <p>{task.description}</p>
    </div>
  {:else}
    <GameQuestTaskProgress task={task} />
  {/if}

  {#if isCommand}
    <GameCommand command={task.action.commandDescription} />
  {/if}
</div>

<style>
  .block {
    padding: 0;
  }
</style>
