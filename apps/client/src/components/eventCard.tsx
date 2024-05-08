import type { IGameEvent } from "../../../../packages/api-sdk/src";
import { useCountdown } from "../hooks/useCountdown";

export const EventCard = ({ event }: { event: IGameEvent }) => {
  const [_days, _hours, minutes, seconds] = useCountdown(event.endsAt);

  let secondsWithZero: string = seconds.toString();
  if (seconds < 10) {
    secondsWithZero = `0${seconds}`;
  }

  const description = getEventDescriptionByType(event.type);

  return (
    <div
      className="w-full h-auto px-4 py-4 bg-primary text-primary border-primary border-b-4 rounded-2xl">
      <p className="text-2xl font-bold">{event.title}</p>
      {description}
      <p className="mt-2 text-base italic">
        Заканчивается через {minutes}:{secondsWithZero}
      </p>
    </div>
  );
};

function getEventDescriptionByType(type: IGameEvent["type"]) {
  if (type === "GROUP_FORM_STARTED") {
    return (
      <div>
        <p className="text-lg leading-tight">
          Хотите в группу? Пишите в чат команду:
        </p>
        <p className="mt-1 text-3xl font-bold">!го</p>
      </div>
    );
  }
}
