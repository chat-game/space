import type { EventMessage } from '@chat-game/types'
import type { EventService, GameAddon } from '../types'

export class BaseEventService implements EventService {
  stream!: EventSource

  constructor(readonly addon: GameAddon, readonly eventsUrl: string) {
    this.stream = new EventSource(this.eventsUrl)

    this.stream.onmessage = (event) => {
      const message = this.#parse(event.data.toString())
      if (!message) {
        return
      }

      void this.#handleMessage(message)
    }
  }

  async #handleMessage(message: EventMessage) {
    if (message.type === 'NEW_PLAYER_MESSAGE') {
      this.addon.handleMessage({
        text: message.data.text,
        player: message.data.player,
        codename: message.data.character.character.codename,
      })
    }
  }

  #parse(message: string): EventMessage | undefined {
    const parsed = JSON.parse(message)
    if (parsed) {
      return parsed as EventMessage
    }

    return undefined
  }
}
