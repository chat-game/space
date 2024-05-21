import { useEffect, useState } from "react"
import { useScene } from "../hooks/useScene"
import { ChunkBlock } from "./chunkBlock"
import { EventsBlock } from "./eventsBlock"
import { GroupBlock } from "./groupBlock.tsx"
import { Loader } from "./loader"
import { RouteBlock } from "./routeBlock"
import { TopPlayersBlock } from "./topPlayers"
import { WagonStatsBlock } from "./wagonStatsBlock"
import { WarehouseBlock } from "./warehouseBlock.tsx"

export const InterfaceLayer = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: { clientX: number; clientY: number }) => {
      setMousePos({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const scene = useScene()

  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    if (!scene?.id) {
      return
    }

    setShowLoader(true)

    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 5000)

    return () => clearInterval(timer)
  }, [scene?.id])

  return (
    <>
      <Loader isVisible={showLoader} />

      <div className="z-10 absolute top-0 left-4 right-4 h-10 px-4 bg-primary border-b-2 border-primary rounded-b-2xl">
        <div className="h-full flex flex-row justify-between items-center">
          <div className="flex flex-row gap-6 items-center">
            <ChunkBlock chunk={scene?.chunk} />
            <WarehouseBlock items={scene?.warehouseItems} />
          </div>

          <div>
            <RouteBlock route={scene?.route} wagon={scene?.wagon} />
          </div>

          <div>
            <WagonStatsBlock wagon={scene?.wagon} />
            <div className="hidden text-sm text-amber-950">
              ({mousePos.x}, {mousePos.y})
            </div>
          </div>
        </div>
      </div>

      <div className="z-10 fixed top-14 left-4">
        <GroupBlock group={scene?.group} />
      </div>

      <div className="z-10 absolute top-14 right-4">
        <EventsBlock events={scene?.events} />
      </div>

      <div className="z-10 absolute bottom-4 left-4 right-4">
        <TopPlayersBlock />
      </div>
    </>
  )
}
