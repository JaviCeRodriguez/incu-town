import React, { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

// Componente para agregar jugadores de prueba
const PlayerSpawner: React.FC = () => {
  const updateOtherPlayer = useGameStore((state) => state.updateOtherPlayer);

  useEffect(() => {
    // Agregar algunos jugadores de prueba
    const testPlayers = [
      {
        id: "player1",
        x: 200,
        y: 150,
        direction: "down" as const,
        state: "idle" as const,
        name: "Ana",
      },
      {
        id: "player2",
        x: 400,
        y: 300,
        direction: "right" as const,
        state: "walking" as const,
        name: "Carlos",
      },
      {
        id: "player3",
        x: 600,
        y: 200,
        direction: "left" as const,
        state: "walking" as const,
        name: "María",
      },
    ];

    // Agregar jugadores con delay
    testPlayers.forEach((player, index) => {
      setTimeout(() => {
        updateOtherPlayer(player.id, player);
      }, index * 1000);
    });

    // Animar algunos jugadores
    const interval = setInterval(() => {
      testPlayers.forEach((player) => {
        if (player.state === "walking") {
          const directions = ["up", "down", "left", "right"] as const;
          const newDirection =
            directions[Math.floor(Math.random() * directions.length)];

          let newX = player.x;
          let newY = player.y;

          switch (newDirection) {
            case "up":
              newY = Math.max(50, player.y - 5);
              break;
            case "down":
              newY = Math.min(700, player.y + 5);
              break;
            case "left":
              newX = Math.max(50, player.x - 5);
              break;
            case "right":
              newX = Math.min(1100, player.x + 5);
              break;
          }

          updateOtherPlayer(player.id, {
            ...player,
            x: newX,
            y: newY,
            direction: newDirection,
          });

          player.x = newX;
          player.y = newY;
        }
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [updateOtherPlayer]);

  return null; // Este componente no renderiza nada visible
};

export default PlayerSpawner;
