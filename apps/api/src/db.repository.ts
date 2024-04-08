import { createId } from "@paralleldrive/cuid2";
import { db } from "./db/db.client";

export function findTopByReputationPlayers() {
  return db.player.findMany({
    where: { reputation: { gt: 0 } },
    orderBy: { reputation: "desc" },
    take: 10,
  });
}

export function findTopByCoinsPlayers() {
  return db.player.findMany({
    orderBy: { coins: "desc" },
    take: 10,
  });
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
