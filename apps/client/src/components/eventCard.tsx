import {
  IconCircleCheck,
  IconCircleDashed,
  IconThumbUp,
} from "@tabler/icons-react"
import type {
  IGameEvent,
  IGamePoll,
  IGameQuest,
  IGameQuestTask,
} from "../../../../packages/api-sdk/src"
import { useCountdown } from "../hooks/useCountdown"

export const EventCard = ({ event }: { event: IGameEvent }) => {
  const [_days, hours, minutes, seconds] = useCountdown(event.endsAt)

  const showSeconds = seconds < 10 ? `0${seconds}` : seconds
  const showMinutes = hours > 0 && minutes < 10 ? `0${minutes}` : minutes
  const showHours = hours > 0 ? `${hours}:` : null

  const isActive = event.status === "STARTED"
  const description = getEventDescriptionByType(event)

  const cardColors = getCardColors(event)

  return (
    <div
      className={`w-full h-auto px-4 py-4 border-b-4 rounded-2xl ${cardColors} translate-x-full data-[active=true]:translate-x-0 duration-500 ease-in-out`}
      data-active={isActive}
    >
      <p className="font-bold text-xl leading-tight">{event.title}</p>
      {description}

      <PollProgressBar poll={event.poll} />
      <QuestTasks quest={event.quest} />

      <p className="mt-3 text-center text-sm italic">
        Заканчивается через {showHours}
        {showMinutes}:{showSeconds}
      </p>
    </div>
  )
}

function getCardColors(event: IGameEvent) {
  if (event.quest?.type === "MAIN") {
    return "text-primary bg-primary border-orange-4"
  }
  if (event.quest?.type === "SIDE") {
    return "text-primary bg-primary border-blue-4"
  }

  return "text-primary bg-primary border-primary"
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
  if (event.type === "VOTING_FOR_NEW_ADVENTURE_STARTED") {
    return (
      <div>
        <p className="font-medium leading-tight">
          Проголосуем за это приключение? Пишите в чат команду:
        </p>
        <p className="mt-1 mb-2 text-2xl font-bold">!го {event.poll?.id}</p>
      </div>
    )
  }
  if (event.type === "ADVENTURE_QUEST_STARTED") {
    return (
      <div>
        <p className="font-medium leading-tight">
          Торговец переживает за свой груз. Для выполнения квеста выполните
          следующее:
        </p>
      </div>
    )
  }
  if (event.type === "VILLAGE_QUEST_STARTED") {
    return (
      <div>
        <p className="font-medium leading-tight">
          Местным жителям нужна помощь. Требуется выполнить следующее:
        </p>
      </div>
    )
  }
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
      <div className="relative w-full h-8 p-1 bg-zinc-100 text-primary rounded-2xl">
        <div className="absolute w-full flex flex-row justify-center">
          Голосов: {poll.votes.length} из {poll.votesToSuccess}
        </div>
        <div
          className="h-6 bg-green-4 border-b-2 border-green-2 rounded-2xl"
          style={{ width: `${pollProgressBarWidth}%` }}
        />
      </div>

      <div className="mt-2 mb-1 flex flex-row flex-wrap gap-2">
        {showUserNames}
      </div>
    </>
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
    task.status === "DONE" ? (
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
  if (task.status === "DONE") {
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
        className="h-6 bg-green-4 border-b-2 border-green-2 rounded-2xl"
        style={{ width: `${progressBarWidth}%` }}
      />
    </div>
  )
}
