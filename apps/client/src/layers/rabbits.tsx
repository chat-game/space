import { useMemo } from "react";
import { RabbitBlock } from "../components/objects/rabbit";
import { useRabbitsStore } from "../store/rabbits";

export const RabbitsLayer = () => {
  const rabbits = useRabbitsStore((state) => state.objects);

  return (
    <>
      {useMemo(
        () =>
          rabbits.map((rabbit) => (
            <RabbitBlock key={rabbit.id} object={rabbit} />
          )),
        [rabbits],
      )}
    </>
  );
};
