import React, { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

// Componente para agregar jugadores de prueba
const PlayerSpawner: React.FC = () => {
  const updateOtherPlayer = useGameStore((state) => state.updateOtherPlayer);

  useEffect(() => {
    // Agregar algunos jugadores de prueba con diferentes proximidades
    const testPlayers = [
      {
        id: "player1",
        x: 96, // Muy cerca del jugador principal (64, 64) - debe escucharse al 100%
        y: 96,
        direction: "down" as const,
        state: "idle" as const,
        name: "Ana",
      },
      {
        id: "player2",
        x: 160, // A ~3 tiles del jugador principal - debe escucharse al ~50%
        y: 128,
        direction: "right" as const,
        state: "walking" as const,
        name: "Carlos",
      },
      {
        id: "player3",
        x: 320, // A ~6 tiles del jugador principal - debe escucharse apenas
        y: 192,
        direction: "left" as const,
        state: "walking" as const,
        name: "María",
      },
      {
        id: "player4",
        x: 600, // Muy lejos - no debe aparecer en el chat de voz
        y: 400,
        direction: "up" as const,
        state: "idle" as const,
        name: "Pedro",
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
