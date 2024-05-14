import type { IGameEvent, IGamePoll } from "../../../../packages/api-sdk/src"
import { useCountdown } from "../hooks/useCountdown"

export const EventCard = ({ event }: { event: IGameEvent }) => {
  const [_days, _hours, minutes, seconds] = useCountdown(event.endsAt)

  let secondsWithZero: string = seconds.toString()
  if (seconds < 10) {
    secondsWithZero = `0${seconds}`
  }

  const description = getEventDescriptionByType(event)

  return (
    <div
      className="w-full h-auto px-4 py-4 bg-primary text-primary border-primary border-b-4 rounded-2xl">
      <p className="font-bold text-xl leading-tight">{event.title}</p>
      {description}

      <PollProgressBar poll={event.poll}/>

      <p className="mt-2 text-center text-sm italic">
        Заканчивается через {minutes}:{secondsWithZero}
      </p>
    </div>
  )
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
}

const PollProgressBar = ({
                           poll,
                         }: {
  poll: IGamePoll | undefined
}) => {
  if (!poll) {
    return null
  }

  const pollProgressBarWidth = Math.round(
    poll.votes.length / (poll.votesToSuccess / 100),
  )

  const thumbUpIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="text-zinc-400"
      role="img"
      aria-label="img"
    >
      <path d="M7 10v12"/>
      <path
        d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
    </svg>
  )

  const showUserNames = poll.votes.map((v) => {
    return (
      <div
        key={v.id}
        className="px-3 py-1 flex flex-row gap-1 text-sm bg-zinc-100 rounded-2xl"
      >
        {thumbUpIcon}
        <span>{v.userName}</span>
      </div>
    )
  })

  return (
    <>
      <div
        className="relative w-full h-8 p-1 bg-zinc-100 text-primary rounded-2xl">
        <div className="absolute w-full flex flex-row justify-center">
          Голосов: {poll.votes.length} из {poll.votesToSuccess}
        </div>
        <div
          className="h-6 bg-green-4 border-b-2 border-green-2 rounded-2xl"
          style={{ width: `${pollProgressBarWidth}%` }}
        />
      </div>

      <div className="mt-2 mb-1 flex flex-row gap-2">{showUserNames}</div>
    </>
  )
}
