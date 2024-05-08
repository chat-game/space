import type { IGameSkill } from "../../../../packages/api-sdk/src";

export const PlayerSkillBlock = ({
                                   skill,
                                   isVisible,
                                 }: {
  skill: IGameSkill | undefined;
  isVisible: boolean;
}) => {
  if (!skill) {
    return null;
  }

  const width = skill.xp / (skill.xpNextLvl / 100);
  const description = getSkillTypeDescription(skill.type);

  return (
    <div className={`text-center ${!isVisible && "hidden"}`}>
      <div className="-mb-1 text-emerald-300 font-bold text-lg">
        {skill.lvl}
      </div>
      <div
        className="relative w-14 h-2 bg-zinc-200/30 border-b-2 border-zinc-500 rounded-2xl">
        <div
          className="h-2 bg-emerald-300 border-b-2 border-emerald-500 rounded-2xl animate-pulse"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="-mt-1 text-emerald-300 text-sm">
        {description}
      </div>
    </div>
  );
};

function getSkillTypeDescription(type: IGameSkill["type"] | null) {
  if (type === "WOODSMAN") return "лесоруб";
  if (type === "MINER") return "шахтер";
}
