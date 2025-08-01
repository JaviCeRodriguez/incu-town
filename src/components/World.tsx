import React, { useEffect } from "react";
import { Rect, Line } from "react-konva";
import { GAME_CONFIG, TILE_TYPES } from "../constants/gameConstants";
import type { TileType } from "../types/game";
import {
  CollisionSystem,
  setGlobalCollisionSystem,
} from "../utils/collisionSystem";

const World: React.FC = () => {
  // Crear un mapa básico con algunos obstáculos
  const createBasicMap = () => {
    const mapWidth = Math.floor(
      GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.TILE_SIZE
    );
    const mapHeight = Math.floor(
      GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.TILE_SIZE
    );
    const map: TileType[][] = [];

    for (let y = 0; y < mapHeight; y++) {
      map[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        // Crear bordes
        if (x === 0 || x === mapWidth - 1 || y === 0 || y === mapHeight - 1) {
          map[y][x] = TILE_TYPES.WALL;
        }
        // Agregar algunas paredes internas como ejemplo
        else if (
          (x === 10 && y > 5 && y < 15) ||
          (y === 10 && x > 15 && x < 25)
        ) {
          map[y][x] = TILE_TYPES.WALL;
        } else {
          map[y][x] = TILE_TYPES.FLOOR;
        }
      }
    }

    return map;
  };

  const map = createBasicMap();

  // Inicializar el sistema de colisiones
  useEffect(() => {
    const collisionSystem = new CollisionSystem(map);
    setGlobalCollisionSystem(collisionSystem);
  }, [map]);

  const renderTiles = () => {
    const tiles = [];
    const mapWidth = Math.floor(
      GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.TILE_SIZE
    );
    const mapHeight = Math.floor(
      GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.TILE_SIZE
    );

    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const tileType = map[y][x];
        let fillColor = GAME_CONFIG.COLORS.FLOOR;

        if (tileType === TILE_TYPES.WALL) {
          fillColor = GAME_CONFIG.COLORS.WALL;
        }

        tiles.push(
          <Rect
            key={`tile-${x}-${y}`}
            x={x * GAME_CONFIG.TILE_SIZE}
            y={y * GAME_CONFIG.TILE_SIZE}
            width={GAME_CONFIG.TILE_SIZE}
            height={GAME_CONFIG.TILE_SIZE}
            fill={fillColor}
            stroke="#bdc3c7"
            strokeWidth={0.5}
          />
        );
      }
    }

    return tiles;
  };

  const renderGrid = () => {
    const lines = [];
    const mapWidth = Math.floor(
      GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.TILE_SIZE
    );
    const mapHeight = Math.floor(
      GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.TILE_SIZE
    );

    // Líneas verticales
    for (let x = 0; x <= mapWidth; x++) {
      lines.push(
        <Line
          key={`v-line-${x}`}
          points={[
            x * GAME_CONFIG.TILE_SIZE,
            0,
            x * GAME_CONFIG.TILE_SIZE,
            GAME_CONFIG.CANVAS_HEIGHT,
          ]}
          stroke="#ecf0f1"
          strokeWidth={0.3}
        />
      );
    }

    // Líneas horizontales
    for (let y = 0; y <= mapHeight; y++) {
      lines.push(
        <Line
          key={`h-line-${y}`}
          points={[
            0,
            y * GAME_CONFIG.TILE_SIZE,
            GAME_CONFIG.CANVAS_WIDTH,
            y * GAME_CONFIG.TILE_SIZE,
          ]}
          stroke="#ecf0f1"
          strokeWidth={0.3}
        />
      );
    }

    return lines;
  };

  return (
    <>
      {/* Fondo */}
      <Rect
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        fill={GAME_CONFIG.COLORS.BACKGROUND}
      />

      {/* Tiles del mapa */}
      {renderTiles()}

      {/* Grid opcional */}
      {renderGrid()}
    </>
  );
};

export default World;
