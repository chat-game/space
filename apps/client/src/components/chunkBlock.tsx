import type { IGameChunk } from "../../../../packages/api-sdk/src";

export const ChunkBlock = ({
  chunk,
}: {
  chunk: IGameChunk | null | undefined;
}) => {
  if (!chunk) {
    return null;
  }

  const description = getChunkTypeDescription(chunk.type);

  return (
    <div className="mt-2 w-72 h-auto px-4 py-4 bg-primary text-primary border-primary border-b-4 rounded-2xl">
      <p className="font-semibold">{description}</p>
      <p className="font-bold text-xl leading-tight">{chunk.title}</p>
    </div>
  );
};

function getChunkTypeDescription(type: IGameChunk["type"]) {
  if (type === "VILLAGE") {
    return "Деревня";
  }
  if (type === "FOREST") {
    return "Лес";
  }
}
