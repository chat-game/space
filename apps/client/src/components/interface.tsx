import { useEffect, useState } from "react"
import { useScene } from "../hooks/useScene"
import { ChunkBlock } from "./chunkBlock"
import { EventsBlock } from "./eventsBlock"
import { GroupPlayersBlock } from "./groupPlayers"
import { Loader } from "./loader"
import { RouteBlock } from "./routeBlock"
import { TopPlayersBlock } from "./topPlayers"
import { WagonStatsBlock } from "./wagonStatsBlock"

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

  const showCommands = scene?.commands?.map((command) => (
    <p key={command} className="font-bold text-xl">
      {command}
    </p>
  ))

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

  const [showPlayersGroup, setShowPlayersGroup] = useState(false)

  useEffect(() => {
    scene?.group ? setShowPlayersGroup(true) : setShowPlayersGroup(false)
  }, [scene?.group])

  return (
    <>
      <Loader isVisible={showLoader} />

      <div className="z-10 absolute bottom-0 left-0">
        {showPlayersGroup ? (
          <GroupPlayersBlock group={scene?.group} />
        ) : (
          <TopPlayersBlock />
        )}
      </div>

      <div className="z-10 fixed top-4 left-4">
        <div className="w-72 h-auto px-4 py-4 bg-primary text-primary border-primary border-b-4 rounded-2xl">
          <div className="flex flex-row gap-1 items-start">
            <img
              src={"/discord.svg"}
              alt=""
              className="-ml-2 -mt-2 w-32 h-32"
            />

            <p>Есть идеи? Присоединяйся к нашему Discord серверу</p>
          </div>

          <p className="mt-3">Пиши команды в чат:</p>
          {showCommands}
        </div>

        <WagonStatsBlock wagon={scene?.wagon} />
        <ChunkBlock chunk={scene?.chunk} />

        <div className="hidden text-sm text-amber-950">
          ({mousePos.x}, {mousePos.y})
        </div>
      </div>

      <div className="z-10 absolute top-0 left-0 right-0">
        <RouteBlock route={scene?.route} wagon={scene?.wagon} />
      </div>

      <div className="z-10 absolute top-0 right-0" style={{ zIndex: 1000 }}>
        <EventsBlock events={scene?.events} />
      </div>
    </>
  )
}
