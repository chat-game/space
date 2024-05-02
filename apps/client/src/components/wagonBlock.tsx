import type {
  IGameObjectWagon,
  IGameRoute,
} from "../../../../packages/api-sdk/src";

export const WagonBlock = ({
  wagon,
  route,
}: {
  wagon: IGameObjectWagon | undefined;
  route: IGameRoute | null | undefined;
}) => {
  if (!wagon || !route) {
    return null;
  }

  const nowX = wagon.x;
  const startX = route.startPoint.x;
  const finishX = route.endPoint.x;

  const distanceAll = Math.abs(finishX - startX);
  const onePercent = Math.round(distanceAll / 100);

  const distanceNowInPercent = Math.round((nowX - startX) / onePercent);

  const distanceAllChunks = Math.round(
    route.chunks[route.chunks.length - 1].area.endX -
      route.chunks[0].area.startX,
  );
  const onePercentAllChunks = Math.round(distanceAllChunks / 100);

  const speedInMeters = wagon.speed;

  return (
    <div className="z-10 fixed top-4 left-1/4 right-1/4">
      <div className="-z-10 relative w-full h-10 p-1.5 bg-primary text-primary border-primary rounded-2xl border-b-4">
        <div className="-z-10 absolute w-full flex flex-row">
          {route.chunks?.map((chunk) => {
            const widthInPercent =
              (chunk.area.endX - chunk.area.startX) / onePercentAllChunks;

            return (
              <div
                key={chunk.id}
                className="border-r last:border-0 text-center"
                style={{ width: `${widthInPercent}%` }}
              >
                {chunk.title}
              </div>
            );
          })}
        </div>
        <div
          className="z-10 h-6 bg-amber-500 border-b-2 border-amber-700 rounded-2xl"
          style={{ width: `${distanceNowInPercent}%` }}
        />
      </div>

      {/*<div*/}
      {/*  className="w-fit h-auto mx-auto -mt-2 px-3 py-2 text-xl text-amber-900 bg-amber-300 border-b-4 rounded-2xl">*/}
      {/*  <p className="font-semibold text-base">Двигаемся</p>*/}
      {/*</div>*/}

      <div className="mt-2 flex flex-row flex-nowrap gap-2 justify-center items-center">
        <div className="w-fit px-3 py-2 font-bold text-xl tracking-tight leading-5 bg-primary text-primary border-primary border-b-4 rounded-2xl">
          Скорость: {speedInMeters} м/сек
        </div>

        <div className="hidden w-fit px-3 py-2 font-bold text-xl tracking-tight leading-5 bg-primary text-primary border-primary border-b-4 rounded-2xl">
          X {Math.round(wagon.x)} Y {Math.round(wagon.y)}
        </div>
      </div>
    </div>
  );
};
