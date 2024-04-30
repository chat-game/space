import type { IGameObjectWagon } from "../../../../packages/api-sdk/src";

export const WagonBlock = ({
  wagon,
}: { wagon: IGameObjectWagon | undefined }) => {
  if (!wagon) {
    return null;
  }

  const distanceToTargetX = 8000 - wagon.x;
  const distanceMoved = 8000 - distanceToTargetX;
  const targetWidth = Math.round(distanceMoved / (8000 / 100));

  const distanceToTargetInMeters = Math.round((8000 - wagon.x) / 30);
  const speedInMeters = wagon.speed;

  return (
    <div className="z-10 fixed top-4 left-1/4 right-1/4">
      <div className="-z-10 relative w-full h-10 p-1.5 bg-primary text-primary border-primary rounded-2xl border-b-4">
        <div
          className="h-6 bg-amber-500 border-b-2 border-amber-700 rounded-2xl"
          style={{ width: `${targetWidth}%` }}
        />
        <div className="absolute top-0.5 left-0 right-0 text-xl text-amber-900 font-bold">
          <div className="mx-auto text-center">
            Еще {distanceToTargetInMeters} м
          </div>
        </div>
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
