import type {
  Player,
  Village,
} from "./types";

export async function getVillage() {
  try {
    const res = await fetch("http://localhost:4001/village");
    return (await res.json()) as Village;
  } catch (err) {
    return null;
  }
}

export async function getTopByReputationPlayers() {
  try {
    const res = await fetch("http://localhost:4001/players/top");
    return (await res.json()) as Player[];
  } catch (err) {
    return null;
  }
}

export async function getTopByCoinsPlayers() {
  try {
    const res = await fetch("http://localhost:4001/players/coins");
    return (await res.json()) as Player[];
  } catch (err) {
    return null;
  }
}
