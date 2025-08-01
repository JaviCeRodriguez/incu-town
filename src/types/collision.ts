// Tipos específicos para el sistema de colisiones

export interface TilePosition {
  x: number;
  y: number;
  type: number;
  isSolid: boolean;
}

export interface CollisionResult {
  hasCollision: boolean;
  resolvedX: number;
  resolvedY: number;
}

export interface MovementInput {
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  width: number;
  height: number;
}

export interface CollisionSystemInterface {
  canMoveTo(x: number, y: number): boolean;
  checkCollision(x: number, y: number, width: number, height: number): boolean;
  resolveMovement(
    currentX: number,
    currentY: number,
    targetX: number,
    targetY: number
  ): { x: number; y: number };
  getNearbyTiles(x: number, y: number, radius?: number): TilePosition[];
}
