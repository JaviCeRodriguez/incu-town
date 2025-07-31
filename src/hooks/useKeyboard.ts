import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

export const useKeyboard = () => {
  const addKeyPressed = useGameStore((state) => state.addKeyPressed);
  const removeKeyPressed = useGameStore((state) => state.removeKeyPressed);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevenir el comportamiento por defecto de las flechas
      if (
        event.code.includes("Arrow") ||
        ["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)
      ) {
        event.preventDefault();
      }
      addKeyPressed(event.code);
    };

    const handleKeyUp = (event) => {
      removeKeyPressed(event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [addKeyPressed, removeKeyPressed]);
};
