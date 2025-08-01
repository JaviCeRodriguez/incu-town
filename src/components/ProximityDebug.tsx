import React from "react";
import { Circle, Group, Text, Line } from "react-konva";
import { useGameStore } from "../store/gameStore";
import { GAME_CONFIG } from "../constants/gameConstants";
import {
  PROXIMITY_CONFIG,
  calculateAllProximities,
} from "../utils/proximitySystem";
import { isDebugEnabled } from "../utils/debug";

interface ProximityDebugProps {
  enabled?: boolean;
}

const ProximityDebug: React.FC<ProximityDebugProps> = ({ enabled = false }) => {
  const player = useGameStore((state) => state.player);
  const otherPlayers = useGameStore((state) => state.otherPlayers);
  const shouldShow = enabled && isDebugEnabled();

  if (!shouldShow) return null;

  // Centro del jugador
  const playerCenterX = player.x + GAME_CONFIG.PLAYER_WIDTH / 2;
  const playerCenterY = player.y + GAME_CONFIG.PLAYER_HEIGHT / 2;

  // Calcular proximidades para mostrar información
  const allProximities = calculateAllProximities(player, otherPlayers);

  return (
    <Group>
      {/* Círculo de distancia máxima de audio */}
      <Circle
        x={playerCenterX}
        y={playerCenterY}
        radius={PROXIMITY_CONFIG.MAX_AUDIO_DISTANCE}
        stroke="#e74c3c"
        strokeWidth={2}
        dash={[10, 10]}
        opacity={0.3}
        listening={false}
      />

      {/* Círculo de 50% de volumen */}
      <Circle
        x={playerCenterX}
        y={playerCenterY}
        radius={PROXIMITY_CONFIG.HALF_VOLUME_DISTANCE}
        stroke="#f39c12"
        strokeWidth={2}
        dash={[5, 5]}
        opacity={0.5}
        listening={false}
      />

      {/* Círculo de volumen máximo */}
      <Circle
        x={playerCenterX}
        y={playerCenterY}
        radius={PROXIMITY_CONFIG.MIN_DISTANCE_FULL_VOLUME}
        stroke="#2ecc71"
        strokeWidth={2}
        opacity={0.7}
        listening={false}
      />

      {/* Círculo de rango de Discord */}
      <Circle
        x={playerCenterX}
        y={playerCenterY}
        radius={PROXIMITY_CONFIG.DISCORD_LIST_DISTANCE}
        stroke="#5865f2"
        strokeWidth={1}
        dash={[15, 5]}
        opacity={0.2}
        listening={false}
      />

      {/* Etiquetas de los círculos */}
      <Text
        x={playerCenterX + PROXIMITY_CONFIG.MIN_DISTANCE_FULL_VOLUME + 5}
        y={playerCenterY - 10}
        text="100% Audio"
        fontSize={10}
        fill="#2ecc71"
        listening={false}
      />

      <Text
        x={playerCenterX + PROXIMITY_CONFIG.HALF_VOLUME_DISTANCE + 5}
        y={playerCenterY - 10}
        text="50% Audio"
        fontSize={10}
        fill="#f39c12"
        listening={false}
      />

      <Text
        x={playerCenterX + PROXIMITY_CONFIG.MAX_AUDIO_DISTANCE + 5}
        y={playerCenterY - 10}
        text="Límite Audio"
        fontSize={10}
        fill="#e74c3c"
        listening={false}
      />

      <Text
        x={playerCenterX + PROXIMITY_CONFIG.DISCORD_LIST_DISTANCE + 5}
        y={playerCenterY + 10}
        text="Rango Discord"
        fontSize={10}
        fill="#5865f2"
        listening={false}
      />

      {/* Líneas de conexión con jugadores cercanos */}
      {allProximities
        .filter((p) => p.proximity.isInDiscordRange)
        .map(({ player: otherPlayer, proximity }) => {
          const otherCenterX = otherPlayer.x + GAME_CONFIG.PLAYER_WIDTH / 2;
          const otherCenterY = otherPlayer.y + GAME_CONFIG.PLAYER_HEIGHT / 2;

          // Color de la línea según el volumen
          let lineColor = "#95a5a6";
          if (proximity.audioVolume >= 0.8) lineColor = "#2ecc71";
          else if (proximity.audioVolume >= 0.5) lineColor = "#f39c12";
          else if (proximity.audioVolume >= 0.1) lineColor = "#e74c3c";

          return (
            <Group key={otherPlayer.id}>
              {/* Línea de conexión */}
              <Line
                points={[
                  playerCenterX,
                  playerCenterY,
                  otherCenterX,
                  otherCenterY,
                ]}
                stroke={lineColor}
                strokeWidth={2}
                opacity={0.6}
                listening={false}
              />

              {/* Información de proximidad */}
              <Text
                x={(playerCenterX + otherCenterX) / 2}
                y={(playerCenterY + otherCenterY) / 2 - 15}
                text={`${Math.round(proximity.audioVolume * 100)}%`}
                fontSize={12}
                fill={lineColor}
                align="center"
                listening={false}
              />

              <Text
                x={(playerCenterX + otherCenterX) / 2}
                y={(playerCenterY + otherCenterY) / 2 + 5}
                text={`${Math.round(proximity.distance)}px`}
                fontSize={10}
                fill="#666"
                align="center"
                listening={false}
              />
            </Group>
          );
        })}
    </Group>
  );
};

export default ProximityDebug;
