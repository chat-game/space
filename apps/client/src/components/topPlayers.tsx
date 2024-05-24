import { useTopPlayers } from "../hooks/useTopPlayers"
import { TopPlayerCard } from "./topPlayerCard"

export const TopPlayersBlock = () => {
  const playersWithResult = useTopPlayers()
  if (!playersWithResult) {
    return null
  }

  return (
    <div className="flex flex-row flex-nowrap gap-2 items-end">
      <div className="w-28 px-3 py-2 font-bold text-xl leading-6 bg-primary text-primary border-primary border-b-4 rounded-2xl">
        Top players
      </div>
      <div className="h-fit flex flex-nowrap gap-2">
        <TopPlayerCard
          player={playersWithResult.viewer?.player}
          points={`${playersWithResult.viewer?.points} points`}
          title={{ title: "Viewer", type: "VIEWER" }}
        />
        <TopPlayerCard
          player={playersWithResult.raider?.player}
          points={`${playersWithResult.raider?.points} viewers`}
          title={{ title: "Raider", type: "RAIDER" }}
        />
        <TopPlayerCard
          player={playersWithResult.rich?.player}
          points={`${playersWithResult.rich?.points} coins`}
          title={{ title: "Rich", type: "RICH" }}
        />
        <TopPlayerCard
          player={playersWithResult.villain?.player}
          points={`${playersWithResult.villain?.points} points`}
          title={{ title: "Villain", type: "VILLAIN" }}
        />
        <TopPlayerCard
          player={playersWithResult.famous?.player}
          points={`${playersWithResult.famous?.points} points`}
          title={{ title: "Good guy", type: "FAMOUS" }}
        />
        <TopPlayerCard
          player={playersWithResult.refueller?.player}
          points={`${playersWithResult.refueller?.points} fuel`}
          title={{ title: "Refueler", type: "REFUELLER" }}
        />
        <TopPlayerCard
          player={playersWithResult.woodsman?.player}
          points={`${playersWithResult.woodsman?.points} level`}
          title={{ title: "Woodman", type: "WOODSMAN" }}
        />
        <TopPlayerCard
          player={playersWithResult.miner?.player}
          points={`${playersWithResult.miner?.points} level`}
          title={{ title: "Miner", type: "MINER" }}
        />
      </div>
    </div>
  )
}
