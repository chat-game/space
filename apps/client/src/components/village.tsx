import { useVillage } from "../hooks/useVillage.ts";

export const Village = () => {
  const village = useVillage();

  const targetWidth =
    village?.globalTarget &&
    village?.globalTargetSuccess &&
    village.globalTarget / (village.globalTargetSuccess / 100);

  return (
    <>
      <div className="fixed top-4 left-80 right-80" style={{ zIndex: 1000 }}>
        <div className="-z-10 relative w-full h-10 p-1.5 bg-amber-100/90 rounded-2xl border-b-4 border-amber-900/90">
          <div
            className="h-6 bg-amber-500 border-b-2 border-amber-700 rounded-2xl"
            style={{ width: `${targetWidth}%` }}
          />
          <div className="absolute top-0.5 left-0 right-0 text-xl text-amber-900 font-bold">
            <div className="mx-auto text-center">
              {village?.globalTarget} / {village?.globalTargetSuccess}
            </div>
          </div>
        </div>

        <div className="w-fit h-auto mx-auto -mt-2 px-3 py-2 text-xl text-amber-900 bg-amber-300 border-b-4 rounded-2xl">
          <p className="font-semibold text-base">
            Фаза Альфа-2: Добываем и складываем камни
          </p>
        </div>
      </div>

      <div className="fixed" style={{ top: 450, left: 450 }}>
        <div style={{ marginTop: 0, marginLeft: 0 }}>
          <div className="flex flex-row gap-4">
            <div className="relative">
              <img
                src={"wood/wood1_64.png"}
                alt=""
                className="ml-0 w-fit h-auto"
              />
              <div className="w-12 absolute top-9 left-2 text-base text-center font-bold text-amber-50">
                {village?.wood}
              </div>
            </div>

            <div className="relative">
              <img
                src={"stone/stone_res1_64.png"}
                alt=""
                className="ml-0 w-fit h-auto"
              />
              <div className="w-12 absolute top-9 left-2 text-base text-center font-bold text-amber-50">
                {village?.stone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
