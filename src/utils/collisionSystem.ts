import { GAME_CONFIG, TILE_TYPES } from "../constants/gameConstants";
import type { TileType } from "../types/game";

// Sistema de colisiones para el juego
export class CollisionSystem {
  private map: TileType[][];
  private tileSize: number;
  private mapWidth: number;
  private mapHeight: number;

  constructor(map: TileType[][]) {
    this.map = map;
    this.tileSize = GAME_CONFIG.TILE_SIZE;
    this.mapHeight = map.length;
    this.mapWidth = map[0]?.length || 0;
  }

  // Convertir coordenadas del mundo a coordenadas de tile
  worldToTile(x: number, y: number): { tileX: number; tileY: number } {
    return {
      tileX: Math.floor(x / this.tileSize),
      tileY: Math.floor(y / this.tileSize),
    };
  }

  // Verificar si una posición específica del tile es sólida
  isTileSolid(tileX: number, tileY: number): boolean {
    // Fuera de bounds = sólido
    if (
      tileX < 0 ||
      tileX >= this.mapWidth ||
      tileY < 0 ||
      tileY >= this.mapHeight
    ) {
      return true;
    }

    const tileType = this.map[tileY][tileX];
    return tileType === TILE_TYPES.WALL;
  }

  // Verificar colisión para un rectángulo (jugador)
  checkCollision(x: number, y: number, width: number, height: number): boolean {
    // Calcular las esquinas del rectángulo del jugador
    const corners = [
      { x: x, y: y }, // Esquina superior izquierda
      { x: x + width - 1, y: y }, // Esquina superior derecha
      { x: x, y: y + height - 1 }, // Esquina inferior izquierda
      { x: x + width - 1, y: y + height - 1 }, // Esquina inferior derecha
    ];

    // Verificar cada esquina
    for (const corner of corners) {
      const { tileX, tileY } = this.worldToTile(corner.x, corner.y);
      if (this.isTileSolid(tileX, tileY)) {
        return true; // Hay colisión
      }
    }

    return false; // No hay colisión
  }

  // Verificar si el jugador puede moverse a una nueva posición
  canMoveTo(newX: number, newY: number): boolean {
    return !this.checkCollision(
      newX,
      newY,
      GAME_CONFIG.PLAYER_WIDTH,
      GAME_CONFIG.PLAYER_HEIGHT
    );
  }

  // Resolver colisión en X (para movimiento suave)
  resolveCollisionX(currentX: number, newX: number, y: number): number {
    const width = GAME_CONFIG.PLAYER_WIDTH;
    const height = GAME_CONFIG.PLAYER_HEIGHT;

    // Si no hay colisión en la nueva posición, permitir el movimiento
    if (!this.checkCollision(newX, y, width, height)) {
      return newX;
    }

    // Si hay colisión, quedarse en la posición actual
    return currentX;
  }

  // Resolver colisión en Y (para movimiento suave)
  resolveCollisionY(x: number, currentY: number, newY: number): number {
    const width = GAME_CONFIG.PLAYER_WIDTH;
    const height = GAME_CONFIG.PLAYER_HEIGHT;

    // Si no hay colisión en la nueva posición, permitir el movimiento
    if (!this.checkCollision(x, newY, width, height)) {
      return newY;
    }

    // Si hay colisión, quedarse en la posición actual
    return currentY;
  }

  // Resolver colisión completa (X e Y separadamente para movimiento más suave)
  resolveMovement(
    currentX: number,
    currentY: number,
    targetX: number,
    targetY: number
  ): { x: number; y: number } {
    // Intentar movimiento en X primero
    const resolvedX = this.resolveCollisionX(currentX, targetX, currentY);

    // Luego intentar movimiento en Y
    const resolvedY = this.resolveCollisionY(resolvedX, currentY, targetY);

    return { x: resolvedX, y: resolvedY };
  }

  // Obtener tiles cercanos para debugging
  getNearbyTiles(x: number, y: number, radius: number = 2) {
    const { tileX, tileY } = this.worldToTile(x, y);
    const tiles = [];

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const checkX = tileX + dx;
        const checkY = tileY + dy;

        if (
          checkX >= 0 &&
          checkX < this.mapWidth &&
          checkY >= 0 &&
          checkY < this.mapHeight
        ) {
          tiles.push({
            x: checkX,
            y: checkY,
            type: this.map[checkY][checkX],
            isSolid: this.isTileSolid(checkX, checkY),
          });
        }
      }
    }

    return tiles;
  }

  // Actualizar el mapa (para cuando se cambie dinámicamente)
  updateMap(newMap: TileType[][]) {
    this.map = newMap;
    this.mapHeight = newMap.length;
    this.mapWidth = newMap[0]?.length || 0;
  }
}

// Instancia global del sistema de colisiones (se inicializará desde World)
let globalCollisionSystem: CollisionSystem | null = null;

export const setGlobalCollisionSystem = (system: CollisionSystem) => {
  globalCollisionSystem = system;
};

export const getGlobalCollisionSystem = (): CollisionSystem | null => {
  return globalCollisionSystem;
};

// Funciones de utilidad para usar desde otros componentes
export const canPlayerMoveTo = (x: number, y: number): boolean => {
  const system = getGlobalCollisionSystem();
  return system ? system.canMoveTo(x, y) : true;
};

export const resolvePlayerMovement = (
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number
): { x: number; y: number } => {
  const system = getGlobalCollisionSystem();
  return system
    ? system.resolveMovement(currentX, currentY, targetX, targetY)
    : { x: targetX, y: targetY };
};
