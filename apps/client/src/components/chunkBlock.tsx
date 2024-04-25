import type { IGameChunk } from "../../../../packages/api-sdk/src";

export const ChunkBlock = ({
  chunk,
}: {
  chunk: IGameChunk | null | undefined;
}) => {
  if (!chunk) {
    return null;
  }

  return (
    <div className="mt-2 w-72 h-auto px-4 py-4 bg-primary text-primary border-primary border-b-4 rounded-2xl">
      <p className="font-semibold">Чанк</p>
      <p className="font-bold text-xl">{chunk.title}</p>

      <p className="mt-2 text-xs">
        X {chunk.center.x} Y {chunk.center.y}
      </p>
    </div>
  );
};
