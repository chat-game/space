import { useMemo } from "react";
import { TreeBlock } from "../components/objects/tree";
import { useTreesStore } from "../store/trees";

export const TreesLayer = () => {
  const trees = useTreesStore((state) => state.objects);

  return (
    <>
      {useMemo(
        () => trees.map((tree) => <TreeBlock key={tree.id} object={tree} />),
        [trees],
      )}
    </>
  );
};
