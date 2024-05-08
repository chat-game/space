import type {
  IGameObjectWagon,
  IGameRoute,
} from "../../../../packages/api-sdk/src"

export const RouteBlock = ({
  wagon,
  route,
}: {
  wagon: IGameObjectWagon | undefined
  route: IGameRoute | null | undefined
}) => {
  if (!wagon || !route) {
    return null
  }

  const nowX = wagon.x
  const startX = route.startPoint.x
  const finishX = route.endPoint.x

  const distanceAll = Math.abs(finishX - startX)
  const onePercent = Math.round(distanceAll / 100)

  const distanceNowInPercent = Math.round((nowX - startX) / onePercent)

  const distanceAllChunks = Math.round(
    route.chunks[route.chunks.length - 1].area.endX -
      route.chunks[0].area.startX,
  )
  const onePercentAllChunks = Math.round(distanceAllChunks / 100)

  return (
    <div className="z-10 fixed top-4 left-1/4 right-1/4">
      <div className="-z-10 relative w-full h-10 p-1.5 bg-primary text-primary border-primary rounded-2xl border-b-4">
        <div className="-z-10 absolute w-full flex flex-row">
          {route.chunks?.map((chunk) => {
            const widthInPercent =
              (chunk.area.endX - chunk.area.startX) / onePercentAllChunks

            return (
              <div
                key={chunk.id}
                className="border-r last:border-0 text-center"
                style={{ width: `${widthInPercent}%` }}
              >
                {chunk.title}
              </div>
            )
          })}
        </div>
        <div
          className="z-10 h-6 bg-amber-500 border-b-2 border-amber-700 rounded-2xl"
          style={{ width: `${distanceNowInPercent}%` }}
        />
      </div>
    </div>
  )
}
