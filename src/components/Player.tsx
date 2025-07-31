import React from "react";
import { Rect, Text, Group } from "react-konva";
import { GAME_CONFIG } from "../constants/gameConstants";
import type { PlayerProps } from "../types/game";

const Player: React.FC<PlayerProps> = ({ player, isCurrentPlayer = false }) => {
  const playerColor = isCurrentPlayer
    ? GAME_CONFIG.COLORS.PLAYER
    : GAME_CONFIG.COLORS.OTHER_PLAYER;

  return (
    <Group x={player.x} y={player.y}>
      {/* Cuerpo del jugador */}
      <Rect
        width={GAME_CONFIG.PLAYER_WIDTH}
        height={GAME_CONFIG.PLAYER_HEIGHT}
        fill={playerColor}
        cornerRadius={4}
        stroke="#000"
        strokeWidth={1}
      />

      {/* Nombre del jugador */}
      <Text
        text={player.name || "Jugador"}
        x={GAME_CONFIG.PLAYER_WIDTH / 2}
        y={-20}
        fontSize={12}
        fill="#000"
        align="center"
        offsetX={20} // Centrar el texto
      />

      {/* Indicador de dirección */}
      <Rect
        x={
          player.direction === "left"
            ? 2
            : player.direction === "right"
            ? GAME_CONFIG.PLAYER_WIDTH - 6
            : GAME_CONFIG.PLAYER_WIDTH / 2 - 2
        }
        y={
          player.direction === "up"
            ? 2
            : player.direction === "down"
            ? GAME_CONFIG.PLAYER_HEIGHT - 6
            : GAME_CONFIG.PLAYER_HEIGHT / 2 - 2
        }
        width={4}
        height={4}
        fill="#fff"
        cornerRadius={2}
      />
    </Group>
  );
};

export default Player;
