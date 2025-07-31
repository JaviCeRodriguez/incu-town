import { create } from "zustand";
import {
  GAME_CONFIG,
  PLAYER_STATES,
  DIRECTIONS,
} from "../constants/gameConstants";
import type { GameStore } from "../types/game";

export const useGameStore = create<GameStore>((set, get) => ({
  // Estado del jugador
  player: {
    id: null,
    x: 100,
    y: 100,
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

  // Lógica de movimiento
  movePlayer: () => {
    const { player, keysPressed } = get();
    let newX = player.x;
    let newY = player.y;
    let direction = player.direction;
    let state = PLAYER_STATES.IDLE;

    if (
      keysPressed.has(GAME_CONFIG.KEYS.UP) ||
      keysPressed.has(GAME_CONFIG.KEYS.W)
    ) {
      newY -= GAME_CONFIG.PLAYER_SPEED;
      direction = DIRECTIONS.UP;
      state = PLAYER_STATES.WALKING;
    }
    if (
      keysPressed.has(GAME_CONFIG.KEYS.DOWN) ||
      keysPressed.has(GAME_CONFIG.KEYS.S)
    ) {
      newY += GAME_CONFIG.PLAYER_SPEED;
      direction = DIRECTIONS.DOWN;
      state = PLAYER_STATES.WALKING;
    }
    if (
      keysPressed.has(GAME_CONFIG.KEYS.LEFT) ||
      keysPressed.has(GAME_CONFIG.KEYS.A)
    ) {
      newX -= GAME_CONFIG.PLAYER_SPEED;
      direction = DIRECTIONS.LEFT;
      state = PLAYER_STATES.WALKING;
    }
    if (
      keysPressed.has(GAME_CONFIG.KEYS.RIGHT) ||
      keysPressed.has(GAME_CONFIG.KEYS.D)
    ) {
      newX += GAME_CONFIG.PLAYER_SPEED;
      direction = DIRECTIONS.RIGHT;
      state = PLAYER_STATES.WALKING;
    }

    // Limitar movimiento dentro del canvas
    newX = Math.max(
      0,
      Math.min(newX, GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.PLAYER_WIDTH)
    );
    newY = Math.max(
      0,
      Math.min(newY, GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PLAYER_HEIGHT)
    );

    set((currentState) => ({
      player: {
        ...currentState.player,
        x: newX,
        y: newY,
        direction,
        state,
      },
    }));
  },
}));
