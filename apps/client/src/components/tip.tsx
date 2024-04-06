export const Tip = ({
  x,
  y,
  message,
}: { x: number; y: number; message: string }) => {
  return (
    <div
      className="fixed px-3 py-1 w-fit text-center bg-amber-100/90 text-amber-900 rounded-2xl font-bold text-sm"
      style={{ top: y, left: x }}
    >
      {message}
    </div>
  );
};
