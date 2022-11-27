import { useAppSelector } from "../hooks";

export const Interface = () => {
  const { x, y, direction } = useAppSelector((state) => state.hero);

  return (
    <div className="interface">
      <div>
        x{x} y{y}
      </div>
      <div>going {direction}</div>
    </div>
  );
};
