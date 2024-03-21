import { useEffect, useState } from "react";
import { type Command, getCommands } from "../../../../packages/api-sdk/src";

export const useCommands = () => {
  const [commands, setCommands] = useState<Command[]>([]);

  useEffect(() => {
    getCommands().then((res) => {
      if (!res) return;

      setCommands(res);
    });

    const reload = setInterval(() => {
      getCommands().then((res) => {
        if (!res) return;

        setCommands(res);
      });
    }, 5000);

    return () => clearInterval(reload);
  }, []);

  return commands;
};
