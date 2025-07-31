// Tipos principales del juego

export interface Player {
  id: string | null;
  x: number;
  y: number;
  direction: Direction;
  state: PlayerState;
  name: string;
}

export interface GameState {
  isConnected: boolean;
  roomId: string | null;
  isGameLoaded: boolean;
}

export interface GameStore {
  // Estado del jugador
  player: Player;

  // Otros jugadores en la sala
  otherPlayers: Record<string, Player>;

  // Estado del juego
  gameState: GameState;

  // Teclas presionadas
  keysPressed: Set<string>;

  // Acciones del jugador
  updatePlayerPosition: (x: number, y: number) => void;
  updatePlayerDirection: (direction: Direction) => void;
  updatePlayerState: (playerState: PlayerState) => void;

  // Gestión de teclas
  addKeyPressed: (key: string) => void;
  removeKeyPressed: (key: string) => void;

  // Gestión de otros jugadores
  updateOtherPlayer: (playerId: string, playerData: Player) => void;
  removeOtherPlayer: (playerId: string) => void;

  // Estado de conexión
  setConnected: (isConnected: boolean) => void;
  setRoomId: (roomId: string) => void;
  setGameLoaded: (isLoaded: boolean) => void;

  // Lógica de movimiento
  movePlayer: () => void;
}

export type Direction = "up" | "down" | "left" | "right";
export type PlayerState = "idle" | "walking";
export type TileType = 0 | 1 | 2; // FLOOR, WALL, SPAWN

export interface PlayerProps {
  player: Player;
  isCurrentPlayer?: boolean;
}

export interface PageProps {
  onJoinGame?: () => void;
  onLeaveGame?: () => void;
}
