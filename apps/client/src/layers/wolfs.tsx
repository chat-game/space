import { useMemo } from "react";
import { WolfBlock } from "../components/objects/wolf";
import { useWolfsStore } from "../store/wolfs";

export const WolfsLayer = () => {
  const wolfs = useWolfsStore((state) => state.objects);

  return (
    <>
      {useMemo(
        () => wolfs.map((wolf) => <WolfBlock key={wolf.id} object={wolf} />),
        [wolfs],
      )}
    </>
  );
};
