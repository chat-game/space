import { useEffect, useState } from "react"
import {
  type GetSceneResponse,
  getSceneInfo,
} from "../../../../packages/api-sdk/src"

export const useScene = () => {
  const [sceneInfo, setSceneInfo] = useState<GetSceneResponse>()

  useEffect(() => {
    getSceneInfo().then((res) => {
      if (!res) return

      setSceneInfo(res)
    })

    const reload = setInterval(() => {
      getSceneInfo().then((res) => {
        if (!res) return

        setSceneInfo(res)
      })
    }, 500)

    return () => clearInterval(reload)
  }, [])

  return sceneInfo
}
