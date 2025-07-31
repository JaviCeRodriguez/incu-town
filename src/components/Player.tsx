import React from "react";
import { Text, Group } from "react-konva";
import { GAME_CONFIG } from "../constants/gameConstants";
import type { PlayerProps } from "../types/game";
import AnimatedSprite from "./AnimatedSprite";

const Player: React.FC<PlayerProps> = ({ player, isCurrentPlayer = false }) => {
  const playerColor = isCurrentPlayer
    ? GAME_CONFIG.COLORS.PLAYER
    : GAME_CONFIG.COLORS.OTHER_PLAYER;

  // Colores aleatorios para otros jugadores basados en su ID
  const getPlayerColor = () => {
    if (isCurrentPlayer) return GAME_CONFIG.COLORS.PLAYER;

    const colors = [
      "#3498db", // Azul
      "#e74c3c", // Rojo
      "#2ecc71", // Verde
      "#f39c12", // Naranja
      "#9b59b6", // Púrpura
      "#1abc9c", // Turquesa
      "#34495e", // Gris oscuro
      "#e67e22", // Naranja oscuro
    ];

    // Usar el ID del jugador para generar un color consistente
    const colorIndex = player.id
      ? Math.abs(player.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
        colors.length
      : 0;

    return colors[colorIndex];
  };

  return (
    <Group x={player.x} y={player.y}>
      {/* Sprite animado del jugador */}
      <AnimatedSprite
        x={0}
        y={0}
        direction={player.direction}
        state={player.state}
        playerColor={getPlayerColor()}
      />

      {/* Nombre del jugador mejorado */}
      <Group>
        {/* Fondo del nombre */}
        <Group x={12} y={-18}>
          <Group
            width={player.name.length * 6 + 8}
            height={14}
            x={-(player.name.length * 3 + 4)}
            y={-2}
          />
        </Group>

        {/* Texto del nombre */}
        <Text
          text={player.name || "Jugador"}
          x={12}
          y={-16}
          fontSize={10}
          fill={isCurrentPlayer ? "#2c3e50" : "#34495e"}
          fontFamily="Arial, sans-serif"
          fontStyle="bold"
          align="center"
          offsetX={player.name.length * 2.5} // Centrar dinámicamente
        />
      </Group>

      {/* Indicador de jugador actual */}
      {isCurrentPlayer && (
        <Group opacity={0.7}>
          <Group x={12} y={-5}>
            <Group width={6} height={2} x={-3} y={0} />
          </Group>
        </Group>
      )}
    </Group>
  );
};

export default Player;
