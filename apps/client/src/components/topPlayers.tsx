import { useTopPlayers } from "../hooks/useTopPlayers"
import { TopPlayerCard } from "./topPlayerCard"

export const TopPlayersBlock = () => {
  const playersWithResult = useTopPlayers()
  if (!playersWithResult) {
    return null
  }

  return (
    <div className="-z-50 fixed bottom-4 left-4">
      <div className="flex flex-row flex-nowrap gap-2 items-end">
        <div className="w-fit px-3 py-2 font-bold text-xl bg-primary text-primary border-primary border-b-4 rounded-2xl">
          Топ игроков
        </div>
        <div className="h-fit flex flex-nowrap gap-2">
          <TopPlayerCard
            player={playersWithResult.viewer?.player}
            points={`${playersWithResult.viewer?.points} баллов`}
            title={{ title: "Зритель", type: "VIEWER" }}
          />
          <TopPlayerCard
            player={playersWithResult.raider?.player}
            points={`${playersWithResult.raider?.points} зрителей`}
            title={{ title: "Рейдер", type: "RAIDER" }}
          />
          <TopPlayerCard
            player={playersWithResult.rich?.player}
            points={`${playersWithResult.rich?.points} монет`}
            title={{ title: "Богач", type: "RICH" }}
          />
          <TopPlayerCard
            player={playersWithResult.villain?.player}
            points={`${playersWithResult.villain?.points} очков`}
            title={{ title: "Злодей", type: "VILLAIN" }}
          />
          <TopPlayerCard
            player={playersWithResult.famous?.player}
            points={`${playersWithResult.famous?.points} очков`}
            title={{ title: "Филантроп", type: "FAMOUS" }}
          />
          <TopPlayerCard
            player={playersWithResult.refueller?.player}
            points={`${playersWithResult.refueller?.points} топлива`}
            title={{ title: "Заправщик", type: "REFUELLER" }}
          />
          <TopPlayerCard
            player={playersWithResult.woodsman?.player}
            points={`${playersWithResult.woodsman?.points} уровень`}
            title={{ title: "Дровосек", type: "WOODSMAN" }}
          />
          <TopPlayerCard
            player={playersWithResult.miner?.player}
            points={`${playersWithResult.miner?.points} уровень`}
            title={{ title: "Шахтер", type: "MINER" }}
          />
        </div>
      </div>
    </div>
  )
}
