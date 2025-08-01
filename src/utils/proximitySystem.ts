import { GAME_CONFIG } from "../constants/gameConstants";
import type { Player } from "../types/game";
import { debugLog } from "./debug";

// Configuración del sistema de proximidad
export const PROXIMITY_CONFIG = {
  // Distancia máxima para escuchar audio (en píxeles)
  MAX_AUDIO_DISTANCE: GAME_CONFIG.TILE_SIZE * 6, // ~6 tiles de distancia máxima

  // Distancia para escuchar al 50% (según la imagen del usuario)
  HALF_VOLUME_DISTANCE: GAME_CONFIG.TILE_SIZE * 3, // ~3 tiles = 50% volume

  // Distancia mínima para volumen máximo
  MIN_DISTANCE_FULL_VOLUME: GAME_CONFIG.TILE_SIZE * 1, // 1 tile = 100% volume

  // Distancia para aparecer en la lista de Discord
  DISCORD_LIST_DISTANCE: GAME_CONFIG.TILE_SIZE * 5, // Aparece en lista si está a 5 tiles o menos

  // Configuración para futuras "oficinas"
  OFFICE_ZONES: {
    FULL_AUDIO: true, // En oficinas se escucha al 100% sin importar distancia
    ZONE_TYPE: "office" as const,
  },
};

export interface ProximityResult {
  distance: number;
  audioVolume: number; // 0 = no se escucha, 1 = volumen máximo
  isInDiscordRange: boolean; // Si debe aparecer en la lista de Discord
  isAudible: boolean; // Si se puede escuchar algo
}

export interface PlayerProximity {
  player: Player;
  proximity: ProximityResult;
}

/**
 * Calcula la distancia euclidiana entre dos jugadores
 */
export const calculateDistance = (player1: Player, player2: Player): number => {
  // Usar el centro de los jugadores para mayor precisión
  const player1CenterX = player1.x + GAME_CONFIG.PLAYER_WIDTH / 2;
  const player1CenterY = player1.y + GAME_CONFIG.PLAYER_HEIGHT / 2;
  const player2CenterX = player2.x + GAME_CONFIG.PLAYER_WIDTH / 2;
  const player2CenterY = player2.y + GAME_CONFIG.PLAYER_HEIGHT / 2;

  const deltaX = player1CenterX - player2CenterX;
  const deltaY = player1CenterY - player2CenterY;

  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

/**
 * Calcula la proximidad entre dos jugadores
 */
export const calculateProximity = (
  currentPlayer: Player,
  otherPlayer: Player,
  isInOfficeZone: boolean = false
): ProximityResult => {
  const distance = calculateDistance(currentPlayer, otherPlayer);

  // Si están en una zona de oficina, audio al 100%
  if (isInOfficeZone) {
    return {
      distance,
      audioVolume: 1.0,
      isInDiscordRange: true,
      isAudible: true,
    };
  }

  // Calcular volumen basado en distancia
  let audioVolume = 0;

  if (distance <= PROXIMITY_CONFIG.MIN_DISTANCE_FULL_VOLUME) {
    // Muy cerca = volumen máximo
    audioVolume = 1.0;
  } else if (distance <= PROXIMITY_CONFIG.MAX_AUDIO_DISTANCE) {
    // Interpolación lineal entre distancia mínima y máxima
    const normalizedDistance =
      (distance - PROXIMITY_CONFIG.MIN_DISTANCE_FULL_VOLUME) /
      (PROXIMITY_CONFIG.MAX_AUDIO_DISTANCE -
        PROXIMITY_CONFIG.MIN_DISTANCE_FULL_VOLUME);
    audioVolume = Math.max(0, 1 - normalizedDistance);
  }

  const isAudible = audioVolume > 0;
  const isInDiscordRange = distance <= PROXIMITY_CONFIG.DISCORD_LIST_DISTANCE;

  debugLog("Proximity calculated", {
    distance: Math.round(distance),
    audioVolume: Math.round(audioVolume * 100) / 100,
    isInDiscordRange,
    isAudible,
    players: {
      current: currentPlayer.name,
      other: otherPlayer.name,
    },
  });

  return {
    distance,
    audioVolume,
    isInDiscordRange,
    isAudible,
  };
};

/**
 * Calcula la proximidad de todos los jugadores respecto al jugador actual
 */
export const calculateAllProximities = (
  currentPlayer: Player,
  otherPlayers: Record<string, Player>,
  isInOfficeZone: boolean = false
): PlayerProximity[] => {
  const proximities: PlayerProximity[] = [];

  Object.values(otherPlayers).forEach((otherPlayer) => {
    if (otherPlayer.id !== currentPlayer.id) {
      const proximity = calculateProximity(
        currentPlayer,
        otherPlayer,
        isInOfficeZone
      );
      proximities.push({
        player: otherPlayer,
        proximity,
      });
    }
  });

  // Ordenar por distancia (más cerca primero)
  proximities.sort((a, b) => a.proximity.distance - b.proximity.distance);

  return proximities;
};

/**
 * Filtrar solo jugadores que están en rango de Discord
 */
export const getPlayersInDiscordRange = (
  proximities: PlayerProximity[]
): PlayerProximity[] => {
  return proximities.filter((p) => p.proximity.isInDiscordRange);
};

/**
 * Filtrar solo jugadores audibles
 */
export const getAudiblePlayers = (
  proximities: PlayerProximity[]
): PlayerProximity[] => {
  return proximities.filter((p) => p.proximity.isAudible);
};

/**
 * Obtener el volumen específico para un jugador
 */
export const getVolumeForPlayer = (
  currentPlayer: Player,
  targetPlayer: Player,
  isInOfficeZone: boolean = false
): number => {
  const proximity = calculateProximity(
    currentPlayer,
    targetPlayer,
    isInOfficeZone
  );
  return proximity.audioVolume;
};

/**
 * Simular estado de "hablando" para jugadores (para pruebas)
 */
export const simulateTalkingState = (): boolean => {
  // 30% de probabilidad de estar hablando
  return Math.random() < 0.3;
};
