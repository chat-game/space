import { useEffect, useState } from "react";
import {
  type Player,
  type PlayerBusinessType,
  type SkillType,
  setPlayerSkillUp,
} from "../../../../packages/api-sdk/src";

export const PlayerSkillBlock = ({
  player,
  isGrowing,
}: {
  player: Player;
  isGrowing: boolean;
}) => {
  const skillType = getSkillTypeByBusinessType(player.businessType);
  const skill = getSkill(player, skillType) ?? 0;
  const skillLvl = getSkillLvl(player, skillType) ?? 0;
  const skillNextLvl = getSkillNextLvl(player, skillType) ?? 0;

  const [visibleSeconds, setVisibleSeconds] = useState(0);
  const isHidden = visibleSeconds <= 0 || !skillType;

  const [width, setWidth] = useState(skill / (skillNextLvl / 100));

  useEffect(() => {
    if (!isGrowing || !skillType) {
      return;
    }

    // Up every 5 seconds
    const reload = setInterval(() => {
      void setPlayerSkillUp(player.id, skillType);
      setWidth(skill / (skillNextLvl / 100));
      setVisibleSeconds((prevState) => prevState + 7);
    }, 5000);

    return () => clearInterval(reload);
  }, [isGrowing, skill, skillNextLvl, skillType, player.id]);

  // -1 every sec
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSeconds((prevState) => (prevState > 0 ? prevState - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const description = getSkillTypeDescription(skillType);

  return (
    <div className={`text-center ${isHidden && "hidden"}`}>
      <div className="-mb-1 text-emerald-300 font-bold text-lg">{skillLvl}</div>
      <div className="relative w-14 h-2 bg-zinc-200/30 border-b-2 border-zinc-500 rounded-2xl">
        <div
          className="h-2 bg-emerald-300 border-b-2 border-emerald-500 rounded-2xl animate-pulse"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="-mt-1 text-emerald-300 font-semibold text-sm">
        {description}
      </div>
    </div>
  );
};

function getSkillTypeDescription(type: SkillType | null) {
  if (!type) return "";

  if (type === "WOOD") return "лесоруб";
  if (type === "MINING") return "шахтер";
}

function getSkillTypeByBusinessType(
  type: PlayerBusinessType,
): SkillType | null {
  if (type === "CHOPPING") return "WOOD";
  if (type === "MINING") return "MINING";
  return null;
}

function getSkill(player: Player, type: SkillType | null) {
  if (!type) return;

  if (type === "WOOD") {
    return player.skillWood;
  }
  if (type === "MINING") {
    return player.skillMining;
  }
}

function getSkillLvl(player: Player, type: SkillType | null) {
  if (!type) return;

  if (type === "WOOD") {
    return player.skillWoodLvl;
  }
  if (type === "MINING") {
    return player.skillMiningLvl;
  }
}

function getSkillNextLvl(player: Player, type: SkillType | null) {
  if (!type) return;

  if (type === "WOOD") {
    return player.skillWoodNextLvl;
  }
  if (type === "MINING") {
    return player.skillMiningNextLvl;
  }
}
