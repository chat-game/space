import { useEffect, useState } from "react";
import { Background } from "../components/background";
import { DealerBlock } from "../components/dealer";
import { Tip } from "../components/tip";
import { TopBlock } from "../components/top";
import { Village } from "../components/village";

export const InterfaceLayer = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: { clientX: number; clientY: number }) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <Background />

      <div className="relative">
        <Village />

        <Tip x={1020} y={150} message="!добывать" />
        <Tip x={160} y={800} message="!рубить" />

        <DealerBlock dealer={{ x: 520, y: 720 }} />

        <div className="fixed top-4 left-4" style={{ zIndex: 1000 }}>
          <div className="w-72 h-auto px-4 py-4 text-amber-900 bg-amber-100/90 border-b-4 rounded-2xl">
            <p className="font-semibold leading-tight">
              Есть идеи? Наше комьюнити:
            </p>
            <p className="font-bold text-2xl text-violet-600">
              discord.gg/B6etUajrGZ
            </p>

            <p className="mt-4 font-semibold">Пиши команды в чат:</p>
            <p className="font-bold text-xl">!рубить</p>
            <p className="font-bold text-xl">!добывать</p>
            <p className="font-bold text-xl">
              !подарить <i className="opacity-70">&lt;название&gt;</i>
            </p>
            <p className="font-bold text-xl">
              !продать <i className="opacity-70">&lt;название&gt;</i>
            </p>

            <p className="hidden mt-4 font-semibold">В разработке:</p>
          </div>

          <div className="text-sm text-amber-950">
            ({mousePos.x}, {mousePos.y})
          </div>
        </div>
      </div>

      <div className="z-10 absolute top-0 left-0">
        <TopBlock />
      </div>
    </>
  );
};
