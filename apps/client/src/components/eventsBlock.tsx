import type { IGameEvent } from "../../../../packages/api-sdk/src"
import { EventCard } from "./eventCard"

export const EventsBlock = ({
  events,
}: { events: IGameEvent[] | undefined }) => {
  if (!events) {
    return null
  }

  const showEvents = events.map((e) => <EventCard key={e.id} event={e} />)

  return (
    <div className="w-96 flex flex-col flex-nowrap gap-4">{showEvents}</div>
  )
}
