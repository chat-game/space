import { useAppSelector } from "../hooks";

export const Interface = () => {
  const { x, y } = useAppSelector((state) => state.hero);

  return (
    <div className="interface">
      <div>
        Hero x{x} y{y}
      </div>
      <div>Interface</div>
    </div>
  );
};
