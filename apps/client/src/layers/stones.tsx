import { useMemo } from "react";
import { StoneBlock } from "../components/objects/stone.tsx";
import { useStonesStore } from "../store/stones.ts";

export const StonesLayer = () => {
  const stones = useStonesStore((state) => state.objects);

  return (
    <>
      {useMemo(
        () =>
          stones.map((stone) => <StoneBlock key={stone.id} object={stone} />),
        [stones],
      )}
    </>
  );
};
