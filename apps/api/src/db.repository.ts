import { createId } from "@paralleldrive/cuid2";
import { db } from "./db/db.client";

export async function findTopPlayers() {
  const famous = await db.player.findFirst({
    orderBy: { reputation: "desc" },
  });
  const rich = await db.player.findFirst({
    orderBy: { coins: "desc" },
  });
  const viewer = await db.player.findFirst({
    orderBy: { viewerPoints: "desc" },
  });
  const woodsman = await findTopWoodsmanPlayer();
  const miner = await findTopMinerPlayer();

  return {
    famous: {
      player: famous,
      points: famous?.reputation,
    },
    rich: {
      player: rich,
      points: rich?.coins,
    },
    viewer: {
      player: viewer,
      points: viewer?.viewerPoints,
    },
    woodsman,
    miner,
  };
}

export async function findTopWoodsmanPlayer() {
  const topSkill = await db.skill.findFirst({
    where: { type: "WOODSMAN" },
    orderBy: { lvl: "desc" },
  });
  if (!topSkill) {
    return null;
  }
  const player = await db.player.findUnique({
    where: { id: topSkill.objectId },
  });

  return {
    player,
    points: topSkill.lvl,
  };
}

export async function findTopMinerPlayer() {
  const topSkill = await db.skill.findFirst({
    where: { type: "MINER" },
    orderBy: { lvl: "desc" },
  });
  if (!topSkill) {
    return null;
  }
  const player = await db.player.findUnique({
    where: { id: topSkill.objectId },
  });

  return {
    player,
    points: topSkill.lvl,
  };
}

export function createCommand(dto: {
  playerId: string;
  command: string;
  target?: string;
}) {
  return db.command.create({
    data: {
      id: createId(),
      playerId: dto.playerId,
      command: dto.command,
      target: dto.target,
    },
  });
}

export function addWoodToVillage(amount: number) {
  return db.village.updateMany({
    data: {
      wood: {
        increment: amount,
      },
    },
  });
}

export async function addStoneToVillage(amount: number) {
  await db.village.updateMany({
    data: {
      stone: {
        increment: amount,
      },
    },
  });

  // Global target
  const village = await findVillage();
  if (village?.globalTargetSuccess && village?.globalTarget) {
    const plusToTarget =
      village.globalTargetSuccess >= village.globalTarget + amount ? amount : 0;

    await db.village.updateMany({
      data: {
        globalTarget: {
          increment: plusToTarget,
        },
      },
    });
  }
}

export function findVillage() {
  return db.village.findFirst();
}
