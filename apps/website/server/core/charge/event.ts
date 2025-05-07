import type { EventMessage } from '@chat-game/types'
import type { ChargeEventService, ChargeInstance, EventStream } from '~~/types/charge'

export class EventService implements ChargeEventService {
  stream: EventStream | null = null

  constructor(readonly charge: ChargeInstance) {}

  async send(event: EventMessage) {
    if (!this.stream) {
      return
    }

    this.stream.push(JSON.stringify(event))
  }
}
