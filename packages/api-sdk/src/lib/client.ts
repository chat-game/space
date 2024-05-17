import type { GetSceneResponse, IGameObjectPlayer } from "./types"

interface PlayerWithPoints {
  player: IGameObjectPlayer
  points: number
}

export interface TopPlayersResponse {
  famous: PlayerWithPoints | null
  rich: PlayerWithPoints | null
  viewer: PlayerWithPoints | null
  raider: PlayerWithPoints | null
  woodsman: PlayerWithPoints | null
  miner: PlayerWithPoints | null
  villain: PlayerWithPoints | null
  refueller: PlayerWithPoints | null
}

export async function getTopPlayers() {
  try {
    const res = await fetch("http://localhost:4001/players/top")
    return (await res.json()) as TopPlayersResponse
  } catch (err) {
    return null
  }
}

export async function getSceneInfo() {
  try {
    const res = await fetch("http://localhost:4001/scene")
    return (await res.json()) as GetSceneResponse
  } catch (err) {
    return null
  }
}
