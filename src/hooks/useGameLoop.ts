import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";

export const useGameLoop = () => {
  const movePlayer = useGameStore((state) => state.movePlayer);
  const isGameLoaded = useGameStore((state) => state.gameState.isGameLoaded);
  const animationFrameRef = useRef();

  useEffect(() => {
    if (!isGameLoaded) return;

    const gameLoop = () => {
      // Actualizar posición del jugador basado en las teclas presionadas
      movePlayer();

      // Continuar el loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Iniciar el game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [movePlayer, isGameLoaded]);
};
