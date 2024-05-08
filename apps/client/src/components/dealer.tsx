import type { ItemType } from "../../../../packages/api-sdk/src"

interface Dealer {
  x: number
  y: number
}

interface Deal {
  command: string
  type: "SELL" | "BUY"
  item: ItemType
  amount: number
  price: number
  isOver?: boolean
}

export const DealerBlock = ({ dealer }: { dealer: Dealer }) => {
  const size = 100
  const height = (size * 64) / 100
  const width = height

  return (
    <div
      className="fixed h-1 w-8 bg-zinc-800/10 rounded-full"
      style={{ zIndex: dealer.y, top: dealer.y, left: dealer.x }}
    >
      <div style={{ width, marginTop: -height, marginLeft: -width / 4 }}>
        <div className="relative">
          <img
            src={"dealer/dealer1_64.png"}
            alt=""
            className="w-fit"
            style={{ height }}
          />

          <div className="-z-10 absolute top-2 left-20">
            <div className="flex flex-row gap-2">
              <DealBlock
                deal={{
                  price: 1,
                  amount: 1,
                  item: "WOOD",
                  type: "BUY",
                  command: "!продать древесину",
                }}
              />
              <DealBlock
                deal={{
                  price: 1,
                  amount: 1,
                  item: "STONE",
                  type: "BUY",
                  command: "!продать камень",
                }}
              />
              <DealBlock
                deal={{
                  price: 10,
                  amount: 1,
                  item: "AXE",
                  type: "SELL",
                  command: "!купить топор",
                }}
              />
              <DealBlock
                deal={{
                  price: 10,
                  amount: 1,
                  item: "PICKAXE",
                  type: "SELL",
                  command: "!купить кирку",
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-fit text-center">
          <div className="px-2 py-0.5 bg-amber-100/90 text-amber-900 rounded-2xl text-xs">
            Торговец
          </div>
        </div>
      </div>
    </div>
  )
}

const DealBlock = ({
  deal,
}: {
  deal: Deal
}) => {
  const item = getDealItem(deal.item, deal.amount)

  return (
    <div
      className={`w-[85px] pb-2 bg-amber-100/90 text-amber-900 rounded-2xl ${
        deal.isOver && "opacity-60"
      }`}
    >
      {deal.isOver && (
        <div className="absolute -rotate-45 mt-10 ml-0 font-bold text-red-600">
          Недоступно
        </div>
      )}
      {item}
      <div className="px-2 py-1 font-bold text-amber-900 text-sm text-center">
        {deal.command}
      </div>

      <div className="flex flex-row gap-1 items-center justify-center">
        <p className="font-bold text-yellow-600">{deal.price}</p>
        <div className="w-5 h-5 bg-yellow-200 border border-b-4 border-yellow-400 rounded-full" />
      </div>
    </div>
  )
}

function getDealItem(type: ItemType, amount: number) {
  if (type === "WOOD") {
    return (
      <div className="-mt-4 relative text-center">
        <img src={"wood/wood1_64.png"} alt="" className="mx-auto w-12 h-auto" />
        <div className="w-full absolute top-6 left-0 text-amber-50 text-base">
          {amount}
        </div>
      </div>
    )
  }
  if (type === "STONE") {
    return (
      <div className="-mt-4 relative text-center">
        <img
          src={"stone/stone_res1_64.png"}
          alt=""
          className="mx-auto w-12 h-auto"
        />
        <div className="w-full absolute top-6 left-0 text-amber-50 text-base">
          {amount}
        </div>
      </div>
    )
  }
  if (type === "AXE") {
    return (
      <div className="-mt-6 -mb-2 relative text-center">
        <img src={"tools/axe1_64.png"} alt="" className="-ml-2 w-18 h-auto" />
      </div>
    )
  }
  if (type === "PICKAXE") {
    return (
      <div className="-mt-6 -mb-2 relative text-center">
        <img
          src={"tools/pickaxe1_64.png"}
          alt=""
          className="-ml-2 w-18 h-auto"
        />
      </div>
    )
  }
}
