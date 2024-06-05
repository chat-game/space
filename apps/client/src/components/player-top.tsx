export const PlayerTopBlock = ({ top }: { top: "BASIC" }) => {
  switch (top) {
    case "BASIC":
      return (
        <img
          src={"hero/top2_64.png"}
          alt=""
          className="absolute"
          style={{
            top: 0,
            left: 0,
          }}
        />
      )
  }
}
