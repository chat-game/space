import {
  IconCircleCheck,
  IconCircleDashed,
  IconClockHour3,
  IconMap2,
  IconThumbUp,
} from "@tabler/icons-react"
import type {
  IGameEvent,
  IGamePoll,
  IGameQuest,
  IGameQuestTask,
  ITradeOffer,
} from "../../../../packages/api-sdk/src"
import { useCountdown } from "../hooks/useCountdown"
import { ItemImage } from "./itemImage.tsx"

export const EventCard = ({ event }: { event: IGameEvent }) => {
  const isActive = event.status === "STARTED"
  const title = event.quest ? event.quest.title : event.title
  const description = getEventDescriptionByType(event)
  const cardInfo = getCardInfoByType(event.type)

  return (
    <div
      className={`relative w-full h-auto px-4 py-4 border-b-4 rounded-2xl text-primary bg-primary ${cardInfo?.cardBorderColor} translate-x-full data-[active=true]:translate-x-0 duration-500 ease-in-out`}
      data-active={isActive}
    >
      <p className="font-bold text-xl leading-tight">{title}</p>
      {description}

      <QuestConditions quest={event.quest} />
      <PollProgressBar poll={event.poll} />
      <QuestTasks quest={event.quest} />
      <TradeOffers offers={event.offers} />
      <EventTimer endsAt={event.endsAt} />
      <CardBottomLabel type={event.type} />
    </div>
  )
}

function getCardInfoByType(type: IGameEvent["type"]) {
  if (type === "MAIN_QUEST_STARTED") {
    return {
      labelBgColor: "bg-teal-500",
      cardBorderColor: "border-teal-500",
      label: "основной квест",
    }
  }
  if (type === "SIDE_QUEST_STARTED") {
    return {
      labelBgColor: "bg-blue-4",
      cardBorderColor: "border-blue-4",
      label: "дополнительный квест",
    }
  }
  if (type === "TRADE_STARTED") {
    return {
      labelBgColor: "bg-teal-500",
      cardBorderColor: "border-teal-500",
      label: "торговля в деревне",
    }
  }
  if (type === "VOTING_FOR_NEW_MAIN_QUEST_STARTED") {
    return {
      labelBgColor: "bg-zinc-500",
      cardBorderColor: "border-zinc-500",
      label: "голосование",
    }
  }

  return {
    cardBorderColor: "border-primary",
  }
}

function getEventDescriptionByType(event: IGameEvent) {
  if (event.type === "GROUP_FORM_STARTED") {
    return (
      <div>
        <p className="text-lg leading-tight">
          Хотите в группу? Пишите в чат команду:
        </p>
        <p className="mt-1 text-3xl font-bold">!го</p>
      </div>
    )
  }
  if (event.type === "VOTING_FOR_NEW_MAIN_QUEST_STARTED") {
    return (
      <div>
        <p className="font-medium leading-tight">
          Сделаем квест активным? Проголосуй командой в чате:
        </p>
        <p className="mt-1 mb-2 py-1 text-2xl font-bold text-center bg-zinc-100 rounded-2xl">
          {event.poll?.commandToVote}
        </p>
      </div>
    )
  }
  if (
    event.type === "MAIN_QUEST_STARTED" ||
    event.type === "SIDE_QUEST_STARTED"
  ) {
    return (
      <div>
        <p className="font-medium leading-tight">{event.quest?.description}</p>
        <p className="mt-3 italic font-medium leading-tight">
          Необходимо выполнить следующее:
        </p>
      </div>
    )
  }
}

const EventTimer = ({ endsAt }: { endsAt: Date }) => {
  const [_days, hours, minutes, seconds] = useCountdown(endsAt)

  const showSeconds = seconds < 10 ? `0${seconds}` : seconds
  const showMinutes = hours > 0 && minutes < 10 ? `0${minutes}` : minutes
  const showHours = hours > 0 ? `${hours}:` : null

  if (hours > 0) {
    return null
  }

  return (
    <p className="mt-3 text-center text-sm italic">
      Заканчивается через {showHours}
      {showMinutes}:{showSeconds}
    </p>
  )
}

const PollProgressBar = ({
  poll,
}: {
  poll: IGamePoll | undefined
}) => {
  if (!poll) {
    return null
  }

  let pollProgressBarWidth = Math.round(
    poll.votes.length / (poll.votesToSuccess / 100),
  )
  if (pollProgressBarWidth > 100) {
    pollProgressBarWidth = 100
  }

  const showUserNames = poll.votes.map((v) => {
    return (
      <div
        key={v.id}
        className="px-3 py-1 flex flex-row gap-1 items-center text-sm bg-zinc-100 rounded-2xl"
      >
        <IconThumbUp stroke={1.5} size={20} />
        <span>{v.userName}</span>
      </div>
    )
  })

  return (
    <>
      <div className="mt-2 relative w-full h-8 p-1 bg-zinc-100 text-primary rounded-2xl">
        <div className="absolute w-full flex flex-row justify-center">
          Голосов: {poll.votes.length} из {poll.votesToSuccess}
        </div>
        <div
          className="h-6 bg-green-300 border-b-2 border-green-600 rounded-2xl"
          style={{ width: `${pollProgressBarWidth}%` }}
        />
      </div>

      <div className="mt-2 mb-1 flex flex-row flex-wrap gap-2">
        {showUserNames}
      </div>
    </>
  )
}

const CardBottomLabel = ({ type }: { type: IGameEvent["type"] }) => {
  const info = getCardInfoByType(type)

  return (
    <div className="absolute -bottom-3.5 left-0 right-0">
      <div
        className={`w-fit mx-auto py-0.5 px-4 lowercase text-sm text-white rounded-xl ${info?.labelBgColor}`}
      >
        {info?.label}
      </div>
    </div>
  )
}

const QuestConditions = ({ quest }: { quest: IGameQuest | undefined }) => {
  if (!quest?.conditions.limitSeconds && !quest?.conditions.chunks) {
    return null
  }

  const minutes = quest.conditions.limitSeconds
    ? Math.round(quest.conditions.limitSeconds / 60)
    : null

  return (
    <div className="mt-3 flex flex-row gap-6 justify-center">
      <div className="flex flex-row gap-1.5">
        <IconClockHour3 stroke={1.5} />
        до {minutes} минут
      </div>
      <div className="flex flex-row gap-1.5">
        <IconMap2 stroke={1.5} />
        Обычные локации
      </div>
    </div>
  )
}

const QuestTasks = ({ quest }: { quest: IGameQuest | undefined }) => {
  if (!quest) {
    return null
  }

  return quest.tasks.map((t) => <QuestTask key={t.id} task={t} />)
}

const QuestTask = ({ task }: { task: IGameQuestTask }) => {
  const taskIcon =
    task.status === "SUCCESS" ? (
      <IconCircleCheck stroke={1.5} className="text-green-2" />
    ) : (
      <IconCircleDashed stroke={1.5} />
    )

  return (
    <div className="mt-2">
      <div className="mb-1 flex flex-row gap-1 items-center font-semibold">
        {taskIcon}
        <p>{task.description}</p>
      </div>

      <QuestTaskProgressBar task={task} />
    </div>
  )
}

const QuestTaskProgressBar = ({ task }: { task: IGameQuestTask }) => {
  if (task.status === "SUCCESS") {
    return null
  }

  if (
    typeof task.progressNow !== "number" ||
    typeof task.progressToSuccess !== "number"
  ) {
    return null
  }

  let progressBarWidth = Math.round(
    task.progressNow / (task.progressToSuccess / 100),
  )
  if (progressBarWidth > 100) {
    progressBarWidth = 100
  }

  return (
    <div className="relative w-full h-8 p-1 bg-zinc-100 rounded-2xl">
      <div className="absolute w-full flex flex-row justify-center">
        {task.progressNow} из {task.progressToSuccess}
      </div>
      <div
        className="h-6 bg-green-300 border-b-2 border-green-600 rounded-2xl"
        style={{ width: `${progressBarWidth}%` }}
      />
    </div>
  )
}

const TradeOffers = ({ offers }: { offers: ITradeOffer[] | undefined }) => {
  if (!offers) {
    return null
  }

  return offers.map((offer) => <TradeOffer key={offer.id} offer={offer} />)
}

const TradeOffer = ({ offer }: { offer: ITradeOffer }) => {
  const type = getTradeOfferType(offer)

  return (
    <div className="flex flex-row items-center">
      <div className="w-10 mt-10 -rotate-90 uppercase text-zinc-400">
        {type}
      </div>
      <div className="mt-2 py-2 pl-2 border-l-4 border-zinc-200 rounded-l-2xl">
        <div className="flex flex-row gap-1 items-center">
          <ItemImage type={offer.item} />
          <p className="text-lg">1 за {offer.unitPrice}</p>
          <ItemImage type={"COIN"} />
        </div>

        <div className="italic">Осталось {offer.amount} ед.</div>

        <div className="mt-2">
          <p className="font-medium leading-tight">Пиши команду в чат:</p>
          <p className="mt-1 mb-2 text-xl font-bold">
            {offer.commandToTrade} [кол-во]
          </p>
        </div>
      </div>
    </div>
  )
}

function getTradeOfferType(offer: ITradeOffer) {
  if (offer.type === "BUY") {
    return "Покупка"
  }
  if (offer.type === "SELL") {
    return "Продажа"
  }
}
