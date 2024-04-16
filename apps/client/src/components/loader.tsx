export const Loader = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <div
      className="grid place-content-center fixed top-0 bottom-0 left-0 right-0 bg-amber-100 border-amber-950 border-y-[35px] -translate-x-full data-[active=true]:translate-x-0 duration-500 ease-in-out"
      style={{ zIndex: 99999 }}
      data-active={isVisible}
    >
      <div className="mx-auto w-64 h-64 animate-bounce">
        <img src={"/hero/hero_512.png"} alt="" width={256} height={256} />
      </div>
    </div>
  );
};
