import { useEffect, useState } from "react";
import { setPlayerWoodSkillUp } from "../../../../packages/api-sdk/src";

export const PlayerSkillBlock = ({
  playerId,
  isGrowing,
  skill,
  skillLvl,
  skillNextLvl,
}: {
  playerId: string;
  isGrowing: boolean;
  skill: number;
  skillLvl: number;
  skillNextLvl: number;
}) => {
  const [visibleSeconds, setVisibleSeconds] = useState(0);
  const isHidden = visibleSeconds <= 0;

  const [width, setWidth] = useState(skill / (skillNextLvl / 100));

  useEffect(() => {
    if (!isGrowing) {
      return;
    }

    // Up every 5 seconds
    const reload = setInterval(() => {
      void setPlayerWoodSkillUp(playerId);
      setWidth(skill / (skillNextLvl / 100));
      setVisibleSeconds((prevState) => prevState + 7);
    }, 5000);

    return () => clearInterval(reload);
  }, [isGrowing, playerId, skill, skillNextLvl]);

  // -1 every sec
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSeconds((prevState) => (prevState > 0 ? prevState - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        лесоруб
      </div>
    </div>
  );
};
