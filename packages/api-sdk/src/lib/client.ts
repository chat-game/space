import type { GetSceneResponse, Player, Village } from "./types";

interface PlayerWithPoints {
  player: Player;
  points: number;
}

export interface TopPlayersResponse {
  famous: PlayerWithPoints | null;
  rich: PlayerWithPoints | null;
  viewer: PlayerWithPoints | null;
  woodsman: PlayerWithPoints | null;
  miner: PlayerWithPoints | null;
}

export async function getVillage() {
  try {
    const res = await fetch("http://localhost:4001/village");
    return (await res.json()) as Village;
  } catch (err) {
    return null;
  }
}

export async function getTopPlayers() {
  try {
    const res = await fetch("http://localhost:4001/players/top");
    return (await res.json()) as TopPlayersResponse;
  } catch (err) {
    return null;
  }
}

export async function getSceneInfo() {
  try {
    const res = await fetch("http://localhost:4001/scene");
    return (await res.json()) as GetSceneResponse;
  } catch (err) {
    return null;
  }
}
