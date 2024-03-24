import type { Command, InventoryItem, Player, Tree, Village } from "./types";

export async function getVillage() {
  try {
    const res = await fetch("http://localhost:4001/village");
    return (await res.json()) as Village;
  } catch (err) {
    return null;
  }
}

export async function getCommands() {
  try {
    const res = await fetch("http://localhost:4001/commands");
    return (await res.json()) as Command[];
  } catch (err) {
    return null;
  }
}

export async function getPlayers() {
  try {
    const res = await fetch("http://localhost:4001/players");
    return (await res.json()) as Player[];
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

export async function getTrees() {
  try {
    const res = await fetch("http://localhost:4001/trees");
    return (await res.json()) as Tree[];
  } catch (err) {
    return null;
  }
}

export async function findTreeToChop() {
  try {
    const res = await fetch("http://localhost:4001/trees/chop");
    return (await res.json()) as Tree;
  } catch (err) {
    return null;
  }
}

export const updateTree = async ({
  id,
  size,
}: { id: string; size: number }) => {
  const res = await fetch(`http://localhost:4001/trees/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      size,
    }),
  });
  return res.json();
};

export const createPlayer = async ({
  id,
  userName,
}: { id: string; userName: string }) => {
  const res = await fetch("http://localhost:4001/players", {
    method: "POST",
    body: JSON.stringify({
      id,
      userName,
    }),
  });
  return res.json();
};

export const setPlayerIsOnTarget = async (id: string) => {
  const res = await fetch(`http://localhost:4001/players/${id}/target`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return res.json();
};

export const setPlayerWoodSkillUp = async (id: string) => {
  const res = await fetch(`http://localhost:4001/players/${id}/skill/wood`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return res.json();
};

export const getPlayerInventory = async (id: string) => {
  try {
    const res = await fetch(`http://localhost:4001/players/${id}/inventory`);
    return (await res.json()) as InventoryItem[];
  } catch (err) {
    return null;
  }
};
