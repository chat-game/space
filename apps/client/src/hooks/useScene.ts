import { useEffect, useState } from "react"
import type { GetSceneResponse } from "../../../../packages/api-sdk/src"
import { game } from "../game"

export const useScene = () => {
  const [sceneInfo, setSceneInfo] = useState<GetSceneResponse>()

  useEffect(() => {
    const scene = game.scene?.getInfo()
    if (scene) {
      setSceneInfo(scene)
    }

    // getSceneInfo().then((res) => {
    //   if (!res) return
    //
    //   setSceneInfo(game.scene.getInfo())
    // })
    //
    const reload = setInterval(() => {
      // getSceneInfo().then((res) => {
      //   if (!res) return
      //
      //   setSceneInfo(game.scene.getInfo())
      // })
      const scene = game.scene?.getInfo()
      if (scene) {
        setSceneInfo(scene)
      }
    }, 500)

    return () => clearInterval(reload)
  }, [])

  return sceneInfo
}
