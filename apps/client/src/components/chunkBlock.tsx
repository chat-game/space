import { IconHome, IconRipple, IconTrees } from "@tabler/icons-react"
import type { IGameChunk } from "../../../../packages/api-sdk/src"

export const ChunkBlock = ({
  chunk,
}: {
  chunk: IGameChunk | null | undefined
}) => {
  if (!chunk) {
    return null
  }

  const chunkInfo = getChunkInfo(chunk.type)

  return (
    <div className="flex flex-row gap-2 items-center text-primary">
      {chunkInfo?.icon}
      <p className="font-bold text-xl">{chunk.title}</p>
    </div>
  )
}

function getChunkInfo(type: IGameChunk["type"]) {
  if (type === "VILLAGE") {
    return {
      description: "Деревня",
      icon: <IconHome />,
    }
  }
  if (type === "FOREST") {
    return {
      description: "Лес",
      icon: <IconTrees />,
    }
  }
  if (type === "LAKE") {
    return {
      description: "Озеро",
      icon: <IconRipple />,
    }
  }
}
