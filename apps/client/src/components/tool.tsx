export const ToolBlock = ({
  tool,
  isWorking,
}: { tool: "AXE" | "PICKAXE"; isWorking: boolean }) => {
  switch (tool) {
    case "AXE":
      return (
        <img
          src={"tools/axe1_64.png"}
          alt=""
          className={`absolute ${isWorking && "animation-tree-chopping"}`}
          style={{ top: -4, left: 4 }}
        />
      );
    case "PICKAXE":
      return (
        <img
          src={"tools/pickaxe1_64.png"}
          alt=""
          className="absolute"
          style={{ top: -4, left: 4 }}
        />
      );
  }
};
