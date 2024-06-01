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
import { ItemImage } from "./itemImage"

export const EventCard = ({ event }: { event: IGameEvent }) => {
  const isActive = event.status === "STARTED"

  return (
    <div
      className="relative w-full h-auto px-4 pt-4 pb-4 border-b-4 border-zinc-300 rounded-2xl text-zinc-600 bg-white translate-x-full data-[active=true]:translate-x-0 duration-500 ease-in-out"
      data-active={isActive}
    >
      <p className="font-bold text-xl leading-tight">{event.title}</p>
      <p className="mb-2 font-medium leading-tight">{event.description}</p>

      <PollProgressBar poll={event.poll} />
      <QuestConditions quest={event.quest} />
      <QuestTasks quest={event.quest} />
      <TradeOffers offers={event.offers} />
      <EventTimer endsAt={event.endsAt} />
      <CardBottomLabel type={event.type} />
    </div>
  )
}

function getCardLabelByType(type: IGameEvent["type"]) {
  if (type === "MAIN_QUEST_STARTED") {
    return "main quest"
  }
  if (type === "SIDE_QUEST_STARTED") {
    return "side quest"
  }
  if (type === "TRADE_STARTED") {
    return "trade in the village"
  }
  if (type === "VOTING_FOR_NEW_MAIN_QUEST_STARTED") {
    return "poll"
  }
  if (type === "IDEA_CREATED") {
    return "idea"
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
      Ends in {showHours}
      {showMinutes}:{showSeconds}
    </p>
  )
}

const Command = ({ command }: { command: string | undefined }) => {
  if (!command) {
    return null
  }

  return (
    <div className="mt-1 py-1 text-xl font-bold text-center bg-gradient-to-r from-violet-500 via-purple-500 to-purple-400 text-white rounded-2xl">
      {command}
    </div>
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
      <div className="relative py-1 w-full h-fit min-h-8 bg-zinc-100 text-zinc-600 rounded-2xl">
        <div className="relative z-20">
          <div className="w-full h-fit px-1 text-zinc-600 rounded-2xl text-lg flex flex-row flex-nowrap gap-1 items-center justify-center leading-5">
            Votes: {poll.votes.length} of {poll.votesToSuccess}
          </div>
        </div>
        <div className="z-10 absolute top-0 h-full w-full">
          <div
            className="hidden h-full bg-purple-200 rounded-2xl"
            style={{ width: `${pollProgressBarWidth}%` }}
          />
        </div>
      </div>

      <Command command={poll.action.commandDescription} />

      <div className="mt-2 mb-1 flex flex-row flex-wrap gap-2">
        {showUserNames}
      </div>
    </>
  )
}

const CardBottomLabel = ({ type }: { type: IGameEvent["type"] }) => {
  const label = getCardLabelByType(type)

  return (
    <div className="absolute -bottom-3.5 left-0 right-0">
      <div className="w-fit mx-auto py-0.5 px-4 lowercase font-semibold text-sm text-zinc-500 bg-zinc-100 rounded-xl">
        {label}
      </div>
    </div>
  )
}

const QuestConditions = ({ quest }: { quest: IGameQuest | undefined }) => {
  if (!quest?.conditions.limitSeconds && !quest?.conditions.chunks) {
    return null
  }

  if (quest.status === "ACTIVE") {
    return null
  }

  const minutes = quest.conditions.limitSeconds
    ? Math.round(quest.conditions.limitSeconds / 60)
    : null

  return (
    <div className="mt-3 flex flex-row gap-6 justify-center">
      <div className="flex flex-row gap-1.5">
        <IconClockHour3 stroke={1.5} />
        up to {minutes} minutes
      </div>
      <div className="flex flex-row gap-1.5">
        <IconMap2 stroke={1.5} />
        Common locations
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
      <IconCircleCheck stroke={1.5} />
    ) : (
      <IconCircleDashed stroke={1.5} />
    )

  const isBoolean = typeof task.progressToSuccess === "boolean"

  return (
    <div className="mb-3">
      {isBoolean && (
        <div className="relative w-full h-8 px-1 bg-zinc-100 text-zinc-600 text-lg rounded-2xl flex flex-row gap-1 items-center">
          {taskIcon}
          <p>{task.description}</p>
        </div>
      )}

      {!isBoolean && <QuestTaskProgressBar task={task} />}

      {task.status === "ACTIVE" && task.action?.commandDescription && (
        <Command command={task.action.commandDescription} />
      )}
    </div>
  )
}

const QuestTaskProgressBar = ({ task }: { task: IGameQuestTask }) => {
  if (
    typeof task.progressNow !== "number" ||
    typeof task.progressToSuccess !== "number"
  ) {
    return null
  }

  const taskIcon =
    task.status === "SUCCESS" ? (
      <IconCircleCheck stroke={1.5} />
    ) : (
      <IconCircleDashed stroke={1.5} />
    )

  let progressBarWidth = Math.round(
    task.progressNow / (task.progressToSuccess / 100),
  )
  if (progressBarWidth > 100) {
    progressBarWidth = 100
  }

  return (
    <div className="relative py-1 w-full h-fit min-h-8 bg-zinc-100 text-zinc-600 rounded-2xl">
      <div className="relative z-20">
        <div className="w-full h-fit px-1 text-zinc-600 rounded-2xl text-lg flex flex-row flex-nowrap gap-1 items-center leading-5">
          {taskIcon}
          <p>{task.description}</p>
        </div>
      </div>
      <div className="z-10 absolute top-0 h-full w-full">
        <div
          className="hidden h-full bg-purple-200 rounded-2xl data-[active=true]:block"
          data-active={task.status === "ACTIVE"}
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>
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
          <p className="text-lg">1 for {offer.unitPrice}</p>
          <ItemImage type={"COIN"} />
        </div>

        <div className="italic">{offer.amount} units left</div>

        <div className="mt-2">
          <p className="font-medium leading-tight">
            Write a command to the chat:
          </p>
          <p className="mt-1 mb-2 text-xl font-bold">
            {offer.commandToTrade} [quantity]
          </p>
        </div>
      </div>
    </div>
  )
}

function getTradeOfferType(offer: ITradeOffer) {
  if (offer.type === "BUY") {
    return "Buying"
  }
  if (offer.type === "SELL") {
    return "Selling"
  }
}
