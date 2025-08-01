import { create } from "zustand";
import {
  GAME_CONFIG,
  PLAYER_STATES,
  DIRECTIONS,
} from "../constants/gameConstants";
import type { GameStore } from "../types/game";
import { resolvePlayerMovement } from "../utils/collisionSystem";

export const useGameStore = create<GameStore>((set, get) => ({
  // Estado del jugador
  player: {
    id: null,
    x: 64, // Posición inicial segura (2 tiles desde el borde)
    y: 64, // Posición inicial segura (2 tiles desde el borde)
    direction: DIRECTIONS.DOWN,
    state: PLAYER_STATES.IDLE,
    name: "Jugador",
  },

  // Otros jugadores en la sala
  otherPlayers: {},

  // Estado del juego
  gameState: {
    isConnected: false,
    roomId: null,
    isGameLoaded: false,
  },

  // Teclas presionadas
  keysPressed: new Set(),

  // Acciones del jugador
  updatePlayerPosition: (x, y) => {
    set((state) => ({
      player: {
        ...state.player,
        x,
        y,
      },
    }));
  },

  updatePlayerDirection: (direction) => {
    set((state) => ({
      player: {
        ...state.player,
        direction,
      },
    }));
  },

  updatePlayerState: (playerState) => {
    set((state) => ({
      player: {
        ...state.player,
        state: playerState,
      },
    }));
  },

  // Gestión de teclas
  addKeyPressed: (key) => {
    set((state) => {
      const newKeysPressed = new Set(state.keysPressed);
      newKeysPressed.add(key);
      return { keysPressed: newKeysPressed };
    });
  },

  removeKeyPressed: (key) => {
    set((state) => {
      const newKeysPressed = new Set(state.keysPressed);
      newKeysPressed.delete(key);
      return { keysPressed: newKeysPressed };
    });
  },

  // Gestión de otros jugadores
  updateOtherPlayer: (playerId, playerData) => {
    set((state) => ({
      otherPlayers: {
        ...state.otherPlayers,
        [playerId]: playerData,
      },
    }));
  },

  removeOtherPlayer: (playerId) => {
    set((state) => {
      const newOtherPlayers = { ...state.otherPlayers };
      delete newOtherPlayers[playerId];
      return { otherPlayers: newOtherPlayers };
    });
  },

  // Estado de conexión
  setConnected: (isConnected) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        isConnected,
      },
    }));
  },

  setRoomId: (roomId) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        roomId,
      },
    }));
  },

  setGameLoaded: (isLoaded) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        isGameLoaded: isLoaded,
      },
    }));
  },

  // Lógica de movimiento con colisiones
  movePlayer: () => {
    const { player, keysPressed } = get();
    let targetX = player.x;
    let targetY = player.y;
    let direction = player.direction;
    let state = PLAYER_STATES.IDLE;

    // Calcular movimiento deseado
    if (
      keysPressed.has(GAME_CONFIG.KEYS.UP) ||
      keysPressed.has(GAME_CONFIG.KEYS.W)
    ) {
      targetY -= GAME_CONFIG.PLAYER_SPEED;
      direction = DIRECTIONS.UP;
      state = PLAYER_STATES.WALKING;
    }
    if (
      keysPressed.has(GAME_CONFIG.KEYS.DOWN) ||
      keysPressed.has(GAME_CONFIG.KEYS.S)
    ) {
      targetY += GAME_CONFIG.PLAYER_SPEED;
      direction = DIRECTIONS.DOWN;
      state = PLAYER_STATES.WALKING;
    }
    if (
      keysPressed.has(GAME_CONFIG.KEYS.LEFT) ||
      keysPressed.has(GAME_CONFIG.KEYS.A)
    ) {
      targetX -= GAME_CONFIG.PLAYER_SPEED;
      direction = DIRECTIONS.LEFT;
      state = PLAYER_STATES.WALKING;
    }
    if (
      keysPressed.has(GAME_CONFIG.KEYS.RIGHT) ||
      keysPressed.has(GAME_CONFIG.KEYS.D)
    ) {
      targetX += GAME_CONFIG.PLAYER_SPEED;
      direction = DIRECTIONS.RIGHT;
      state = PLAYER_STATES.WALKING;
    }

    // Limitar movimiento dentro del canvas
    targetX = Math.max(
      0,
      Math.min(targetX, GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.PLAYER_WIDTH)
    );
    targetY = Math.max(
      0,
      Math.min(targetY, GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_HEIGHT)
    );

    // Resolver colisiones - esto calculará la posición final válida
    const resolvedPosition = resolvePlayerMovement(
      player.x,
      player.y,
      targetX,
      targetY
    );

    set((currentState) => ({
      player: {
        ...currentState.player,
        x: resolvedPosition.x,
        y: resolvedPosition.y,
        direction,
        state,
      },
    }));
  },
}));
