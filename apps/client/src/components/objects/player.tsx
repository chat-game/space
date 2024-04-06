import { useEffect, useState } from "react";
import type {
  GameObjectPlayer,
  InventoryItem,
  ItemType,
  Skill,
} from "../../../../../packages/api-sdk/src";
import { PlayerSkillBlock } from "../player-skill";
import { ToolBlock } from "../tool.tsx";

export const PlayerBlock = ({ object }: { object: GameObjectPlayer }) => {
  const size = 100;
  const height = (size * 64) / 100;
  const width = height;

  const color = object.colorIndex / 100; // from 0 to 100 => 0 to 1

  const leftSprite = "hero/hero_empty_left_64.png";
  const rightSprite = "hero/hero_empty_right_64.png";

  const leftShirtSprite = "hero/top2_left_64.png";
  const rightShirtSprite = "hero/top2_right_64.png";

  const zIndex = Math.round(object.y);

  const [showInHand, setShowInHand] = useState<ItemType | undefined>();
  const [showSkill, setShowSkill] = useState<Skill | undefined>();

  useEffect(() => {
    if (object.state === "CHOPPING") {
      setShowInHand("WOOD");
      const skill = object.skills.find((skill) => skill.type === "WOODSMAN");
      if (skill) {
        setShowSkill(skill);
      }
    }
    if (object.state === "MINING") {
      setShowInHand("STONE");
      const skill = object.skills.find((skill) => skill.type === "MINER");
      if (skill) {
        setShowSkill(skill);
      }
    }
  }, [object.state, object.skills]);

  const [handVisibleSeconds, setHandVisibleSeconds] = useState(0);
  const [skillVisibleSeconds, setSkillVisibleSeconds] = useState(0);

  useEffect(() => {
    if (object.state === "CHOPPING" || object.state === "MINING") {
      setHandVisibleSeconds(50);
      setSkillVisibleSeconds(50);
    }

    const timer = setInterval(() => {
      setHandVisibleSeconds((prevState) => (prevState > 0 ? prevState - 1 : 0));
      setSkillVisibleSeconds((prevState) =>
        prevState > 0 ? prevState - 1 : 0,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [object.state]);

  return (
    <div
      className="fixed h-0 w-8"
      style={{ zIndex, top: object.y, left: object.x }}
    >
      <div
        className="-z-10 absolute bg-zinc-900/5 rounded-full"
        style={{
          width: width * 0.65,
          height: height * 0.45,
          top: -height * 0.35,
        }}
      />
      <div style={{ width, marginTop: -height, marginLeft: -width / 4 }}>
        <div
          className={`relative ${
            object.state === "MOVING" && "animation-player-move"
          }`}
        >
          <img
            src={object.direction === "LEFT" ? leftSprite : rightSprite}
            alt=""
            className="w-fit"
            style={{ height }}
          />
          <img
            src={
              object.direction === "LEFT" ? leftShirtSprite : rightShirtSprite
            }
            alt=""
            className="absolute"
            style={{
              top: 0,
              left: 0,
              filter: `hue-rotate(${color}turn)`,
            }}
          />

          <PlayerHandsBlock
            items={object.inventory?.items ?? []}
            showItemType={showInHand}
            isVisible={handVisibleSeconds > 0}
          />

          <ToolBlock object={object} />
        </div>

        <div className="absolute -top-14 left-14">
          <PlayerSkillBlock
            skill={showSkill}
            isVisible={skillVisibleSeconds > 0}
          />
        </div>

        <div className="mt-1 w-fit text-center">
          <div className="px-2 py-0.5 bg-amber-100/90 text-amber-900 rounded-2xl font-semibold text-xs tracking-tight">
            {object?.userName}
          </div>
          <div className="-mt-0.5 flex flex-row gap-1 justify-center tracking-tight">
            {object?.reputation > 0 && (
              <div className="px-2 py-1.5 bg-blue-200 text-xs text-blue-700 border-t-2 font-bold rounded-lg">
                {object.reputation}
              </div>
            )}
            {object?.coins > 0 && (
              <div className="px-2 py-1.5 bg-yellow-200 text-xs text-yellow-600 border-t-2 font-bold rounded-full">
                {object.coins}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerHandsBlock = ({
  items,
  showItemType,
  isVisible,
}: {
  items: InventoryItem[];
  showItemType: ItemType | undefined;
  isVisible: boolean;
}) => {
  if (!showItemType) {
    return null;
  }

  const item = items.find((item) => item.type === showItemType);
  if (!item) {
    return null;
  }

  return (
    <div className={`absolute top-5 -left-1 ${!isVisible && "hidden"}`}>
      <div className="w-8">
        <ResourceIcon type={showItemType} />
      </div>
      <div className="absolute top-3.5 left-2 text-center text-amber-100 text-sm font-semibold">
        {item.amount}
      </div>
    </div>
  );
};

const ResourceIcon = ({ type }: { type: ItemType }) => {
  if (type === "WOOD") {
    return <img src={"wood/wood1_64.png"} alt="" />;
  }
  if (type === "STONE") {
    return <img src={"stone/stone_res1_64.png"} alt="" />;
  }
};
