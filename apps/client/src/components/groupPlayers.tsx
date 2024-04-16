import type { IGameGroup } from "../../../../packages/api-sdk/src";
import { GroupPlayerCard } from "./groupPlayerCard";

export const GroupPlayersBlock = ({
  group,
}: { group: IGameGroup | undefined }) => {
  if (!group) {
    return null;
  }

  const showPlayers = group.players.map((p) => (
    <GroupPlayerCard key={p.id} player={p} />
  ));

  return (
    <div className="-z-50 fixed bottom-4 left-4">
      <div className="flex flex-row flex-nowrap gap-2 items-end">
        <div className="w-fit px-3 py-2 font-bold text-xl tracking-tight leading-5 text-amber-900 bg-amber-100/90 border-b-4 rounded-2xl">
          Группа
        </div>
        <div className="h-fit flex flex-nowrap gap-2">{showPlayers}</div>
      </div>
    </div>
  );
};
