import type { IGameGroup } from "../../../../packages/api-sdk/src"
import { GroupPlayerCard } from "./groupPlayerCard.tsx"

export const GroupBlock = ({ group }: { group: IGameGroup | undefined }) => {
  if (!group) {
    return null
  }

  const showPlayers = group.players.map((p) => (
    <GroupPlayerCard key={p.id} player={p} />
  ))

  return <div className="w-96 flex flex-col gap-2">{showPlayers}</div>
}
