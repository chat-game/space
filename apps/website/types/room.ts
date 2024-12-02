import type { Peer } from 'crossws'

export interface Room {
  id: string
  type: 'ADDON' | 'GAME'
  token: string
  server: {
    ws: WebSocket
    peer: Peer | null
  }
}
