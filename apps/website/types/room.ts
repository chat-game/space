import type { Peer } from 'crossws'

export interface Room {
  id: string
  type: 'ADDON' | 'WAGON'
  token: string
  server: {
    ws: WebSocket
    peer: Peer | null
  }
  peers: string[]
}
