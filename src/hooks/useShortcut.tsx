import { useEffect } from "react";

const useShortcut = (
  keys: Array<"alt" | "ctrl" | "shift" | "meta" | string>,
  callback: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyPressed = event.key.toLowerCase();
      const modifiers = {
        alt: event.altKey,
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        meta: event.metaKey,
      };

      const isMatch = keys.every((key) =>
        ["alt", "ctrl", "shift", "meta"].includes(key)
          ? modifiers[key as keyof typeof modifiers]
          : keyPressed === key.toLowerCase()
      );

      if (isMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback]);
};

export default useShortcut;
