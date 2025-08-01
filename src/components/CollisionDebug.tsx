import React, { useState } from "react";
import { Rect, Group } from "react-konva";
import { useGameStore } from "../store/gameStore";
import { getGlobalCollisionSystem } from "../utils/collisionSystem";
import { GAME_CONFIG } from "../constants/gameConstants";
import { isDebugEnabled } from "../utils/debug";

interface CollisionDebugProps {
  enabled?: boolean;
}

const CollisionDebug: React.FC<CollisionDebugProps> = ({ enabled = false }) => {
  // Solo mostrar si debug está habilitado Y el prop enabled es true
  const shouldShow = enabled && isDebugEnabled();
  const player = useGameStore((state) => state.player);
  const [showNearbyTiles, setShowNearbyTiles] = useState(false);

  if (!shouldShow) return null;

  const collisionSystem = getGlobalCollisionSystem();
  if (!collisionSystem) return null;

  // Obtener tiles cercanos al jugador
  const nearbyTiles = collisionSystem.getNearbyTiles(
    player.x + GAME_CONFIG.PLAYER_WIDTH / 2,
    player.y + GAME_CONFIG.PLAYER_HEIGHT / 2,
    3
  );

  return (
    <Group>
      {/* Visualizar hitbox del jugador */}
      <Rect
        x={player.x}
        y={player.y}
        width={GAME_CONFIG.PLAYER_WIDTH}
        height={GAME_CONFIG.PLAYER_HEIGHT}
        stroke="#ff0000"
        strokeWidth={2}
        dash={[5, 5]}
        listening={false}
      />

      {/* Visualizar tiles cercanos */}
      {showNearbyTiles &&
        nearbyTiles.map((tile, index) => (
          <Rect
            key={index}
            x={tile.x * GAME_CONFIG.TILE_SIZE}
            y={tile.y * GAME_CONFIG.TILE_SIZE}
            width={GAME_CONFIG.TILE_SIZE}
            height={GAME_CONFIG.TILE_SIZE}
            stroke={tile.isSolid ? "#ff0000" : "#00ff00"}
            strokeWidth={1}
            fill={tile.isSolid ? "rgba(255,0,0,0.2)" : "rgba(0,255,0,0.1)"}
            listening={false}
          />
        ))}

      {/* Indicador de posición del jugador en grid */}
      <Group
        x={
          Math.floor(
            (player.x + GAME_CONFIG.PLAYER_WIDTH / 2) / GAME_CONFIG.TILE_SIZE
          ) * GAME_CONFIG.TILE_SIZE
        }
        y={
          Math.floor(
            (player.y + GAME_CONFIG.PLAYER_HEIGHT / 2) / GAME_CONFIG.TILE_SIZE
          ) * GAME_CONFIG.TILE_SIZE
        }
      >
        <Rect
          width={GAME_CONFIG.TILE_SIZE}
          height={GAME_CONFIG.TILE_SIZE}
          stroke="#ffff00"
          strokeWidth={3}
          dash={[3, 3]}
          listening={false}
        />
      </Group>
    </Group>
  );
};

export default CollisionDebug;
