import type { ItemType } from "../../../../packages/api-sdk/src";

interface Dealer {
  x: number;
  y: number;
}

interface Deal {
  type: "SELL" | "BUY";
  item: ItemType;
  amount: number;
  price: number;
  isOver?: boolean;
}

export const DealerBlock = ({ dealer }: { dealer: Dealer }) => {
  const size = 100;
  const height = (size * 64) / 100;

  return (
    <div
      className="fixed"
      style={{ zIndex: dealer.y + height, top: dealer.y, left: dealer.x }}
    >
      <div style={{ marginTop: -height + 16, marginLeft: -height / 2 }}>
        <div className="relative">
          <img
            src={"dealer/dealer1_64.png"}
            alt=""
            className="w-fit"
            style={{ height: height }}
          />

          <div className="absolute -top-6 left-12">
            <div className="w-40 px-2 py-1 bg-amber-100/90 text-amber-900 rounded-2xl font-semibold text-sm tracking-tight leading-tight">
              Приветствую, герои!
            </div>
          </div>

          <div className="absolute top-6 left-20">
            <div className="flex flex-row gap-2">
              <DealBlock
                deal={{ price: 1, amount: 1, item: "WOOD", type: "BUY" }}
              />
              <DealBlock
                deal={{
                  price: 20,
                  amount: 1,
                  item: "AXE",
                  type: "SELL",
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-fit text-center">
          <div className="px-2 py-0.5 bg-amber-100/90 text-amber-900 rounded-2xl font-semibold text-xs tracking-tight">
            Торговец
          </div>
        </div>
      </div>
    </div>
  );
};

const DealBlock = ({
  deal,
}: {
  deal: Deal;
}) => {
  const message = getDealMessage(deal.type);
  const item = getDealItem(deal.item, deal.amount);

  return (
    <div
      className={`w-24 pb-2 bg-amber-100/90 text-amber-900 rounded-2xl ${
        deal.isOver && "opacity-60"
      }`}
    >
      {deal.isOver && (
        <div className="absolute -rotate-45 mt-10 ml-0 font-bold text-red-600">
          Недоступно
        </div>
      )}
      {item}
      <div className="px-2 py-1 text-amber-900 rounded-2xl font-semibold text-sm text-center tracking-tight leading-tight">
        {message}
      </div>

      <div className="flex flex-row gap-1 items-center justify-center">
        <p className="font-bold text-yellow-600">{deal.price}</p>
        <div className="w-5 h-5 bg-yellow-200 border border-b-4 border-yellow-400 rounded-full" />
      </div>
    </div>
  );
};

function getDealMessage(type: "BUY" | "SELL") {
  if (type === "BUY") {
    return <span className="font-bold">!продать древесину</span>;
  }
  if (type === "SELL") {
    return <span className="font-bold">!купить топор</span>;
  }
}

function getDealItem(type: ItemType, amount: number) {
  if (type === "WOOD") {
    return (
      <div className="-mt-4 relative text-center">
        <img src={"wood/wood1_64.png"} alt="" className="mx-auto w-12 h-auto" />
        <div className="w-full absolute top-6 left-0 text-amber-100 text-base font-semibold">
          {amount}
        </div>
      </div>
    );
  }
  if (type === "AXE") {
    return (
      <div className="-mt-6 -mb-2 relative text-center">
        <img src={"tools/axe1_64.png"} alt="" className="-ml-1 w-18 h-auto" />
      </div>
    );
  }
  if (type === "PICKAXE") {
    return (
      <div className="-mt-6 -mb-2 relative text-center">
        <img
          src={"tools/pickaxe1_64.png"}
          alt=""
          className="-ml-1 w-18 h-auto"
        />
      </div>
    );
  }
}
