import paperTexture
  from "../game/assets/images/background/paper-background-1.jpg"
import { useScene } from "../hooks/useScene"
import { ChunkBlock } from "./chunkBlock"
import { EventsBlock } from "./eventsBlock"
import { GroupBlock } from "./groupBlock"
import { RouteBlock } from "./routeBlock"
import { TopPlayersBlock } from "./topPlayers"
import { WagonStatsBlock } from "./wagonStatsBlock"
import { WarehouseBlock } from "./warehouseBlock"

export const InterfaceLayer = () => {
  const scene = useScene()

  return (
    <>
      {/*<Loader/>*/}

      <div
        className="z-10 absolute top-0 left-0 right-0 h-10 px-4 bg-primary border-b-2 border-primary shadow-lg"
        style={{
          backgroundImage: `url(${paperTexture})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
        }}
      >
        <div className="h-full flex flex-row justify-between items-center">
          <div className="flex flex-row gap-6 items-center">
            <ChunkBlock chunk={scene?.chunk}/>
            <WarehouseBlock items={scene?.warehouseItems}/>
          </div>

          <div>
            <RouteBlock route={scene?.route} wagon={scene?.wagon}/>
          </div>

          <div>
            <WagonStatsBlock wagon={scene?.wagon}/>
          </div>
        </div>
      </div>

      <div className="z-10 fixed top-14 left-4">
        <GroupBlock group={scene?.group}/>
      </div>

      <div className="z-10 absolute top-14 right-4">
        <EventsBlock events={scene?.events}/>
      </div>

      <div className="z-10 absolute bottom-4 left-4 right-4">
        <TopPlayersBlock/>
      </div>
    </>
  )
}
