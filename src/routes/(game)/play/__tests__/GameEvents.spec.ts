import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import GameEvents from '../GameEvents.svelte'
import type { IGameEvent } from '$lib/game/services/event/interface'

describe('gameEvents', () => {
  it('renders the correct number of GameEventCard components', () => {
    const events: IGameEvent[] = [
      {
        id: '1',
        title: 'Idea created',
        description: 'Idea created by user',
        type: 'IDEA_CREATED',
        status: 'STARTED',
        endsAt: new Date(),
        checkStatus: () => 'STARTED',
      },
    ]
    const { getByText } = render(GameEvents, { props: { events } })

    for (const event of events) {
      expect(() => getByText(event.title)).not.toThrow()
    }
  })

  it('renders no GameEventCard components when events array is empty', () => {
    const events: IGameEvent[] = []
    const { container } = render(GameEvents, { events })

    expect(container.firstElementChild?.childElementCount).toBe(0)
  })
})
