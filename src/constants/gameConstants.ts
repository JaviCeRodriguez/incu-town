import type { Direction, PlayerState, TileType } from "../types/game";

// Constantes del juego
export const GAME_CONFIG = {
  // Dimensiones del canvas
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,

  // Dimensiones del tile/celda
  TILE_SIZE: 32,

  // Velocidad del jugador
  PLAYER_SPEED: 2,

  // Dimensiones del jugador
  PLAYER_WIDTH: 24,
  PLAYER_HEIGHT: 32,

  // Colores del juego
  COLORS: {
    BACKGROUND: "#2c3e50",
    FLOOR: "#ecf0f1",
    WALL: "#34495e",
    PLAYER: "#e74c3c",
    OTHER_PLAYER: "#3498db",
  },

  // Teclas de movimiento
  KEYS: {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    W: "KeyW",
    A: "KeyA",
    S: "KeyS",
    D: "KeyD",
  },
};

// Tipos de tiles para el mapa
export const TILE_TYPES = {
  FLOOR: 0 as const,
  WALL: 1 as const,
  SPAWN: 2 as const,
} satisfies Record<string, TileType>;

// Estados del jugador
export const PLAYER_STATES = {
  IDLE: "idle" as const,
  WALKING: "walking" as const,
} satisfies Record<string, PlayerState>;

// Direcciones
export const DIRECTIONS = {
  UP: "up" as const,
  DOWN: "down" as const,
  LEFT: "left" as const,
  RIGHT: "right" as const,
} satisfies Record<string, Direction>;
