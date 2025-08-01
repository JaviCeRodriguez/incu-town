import React, { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import {
  calculateAllProximities,
  getPlayersInDiscordRange,
  simulateTalkingState,
} from "../utils/proximitySystem";
import { useMicrophone } from "../hooks/useMicrophone";
import { isDebugEnabled } from "../utils/debug";
import "./VoiceChat.css";

interface TalkingState {
  [playerId: string]: boolean;
}

const VoiceChat: React.FC = () => {
  const player = useGameStore((state) => state.player);
  const otherPlayers = useGameStore((state) => state.otherPlayers);
  const [talkingStates, setTalkingStates] = useState<TalkingState>({});
  const debugEnabled = isDebugEnabled();

  // Hook para detectar micrófono real
  const microphone = useMicrophone();

  // Simular estados de "hablando" para otros jugadores
  useEffect(() => {
    const interval = setInterval(() => {
      const newTalkingStates: TalkingState = {};

      // Simular para otros jugadores
      Object.keys(otherPlayers).forEach((playerId) => {
        newTalkingStates[playerId] = simulateTalkingState();
      });

      setTalkingStates(newTalkingStates);
    }, 2000); // Cambiar cada 2 segundos

    return () => clearInterval(interval);
  }, [otherPlayers]);

  // Usar estado real del micrófono para el jugador actual
  useEffect(() => {
    setTalkingStates((prev) => ({
      ...prev,
      "current-player": microphone.isTalking,
    }));
  }, [microphone.isTalking]);

  // Calcular proximidades
  const allProximities = calculateAllProximities(player, otherPlayers);
  const playersInRange = getPlayersInDiscordRange(allProximities);

  // Crear entrada para el jugador actual (siempre visible)
  const currentPlayerEntry = {
    player: player,
    proximity: {
      distance: 0,
      audioVolume: microphone.hasPermission ? microphone.volume : 1.0, // Volumen real del micrófono
      isInDiscordRange: true,
      isAudible: true,
    },
    isCurrentPlayer: true,
  };

  // Combinar jugador actual con otros jugadores en rango
  const allVisiblePlayers = [currentPlayerEntry, ...playersInRange];

  // Siempre mostrar si hay debug habilitado o si hay jugadores en rango
  if (playersInRange.length === 0 && !debugEnabled) {
    return null;
  }

  const getVolumeIcon = (volume: number): string => {
    if (volume >= 0.8) return "🔊";
    if (volume >= 0.5) return "🔉";
    if (volume >= 0.1) return "🔈";
    return "🔇";
  };

  const getVolumeColor = (volume: number): string => {
    if (volume >= 0.8) return "#2ecc71"; // Verde
    if (volume >= 0.5) return "#f39c12"; // Naranja
    if (volume >= 0.1) return "#e74c3c"; // Rojo
    return "#95a5a6"; // Gris
  };

  return (
    <div className="voice-chat">
      <div className="voice-chat-header">
        <span className="voice-icon">🎙️</span>
        <h3>Chat de Voz</h3>
        <span className="player-count">{playersInRange.length}</span>
      </div>

      <div className="voice-chat-list">
        {allVisiblePlayers.map(
          ({ player: otherPlayer, proximity, isCurrentPlayer }) => {
            const playerId = isCurrentPlayer
              ? "current-player"
              : otherPlayer.id || "";
            const isTalking = talkingStates[playerId];
            const volumePercentage = Math.round(proximity.audioVolume * 100);

            return (
              <div
                key={otherPlayer.id || "current-player"}
                className={`voice-player ${isTalking ? "talking" : ""} ${
                  isCurrentPlayer ? "current-player" : ""
                }`}
              >
                <div className="player-avatar">
                  <div
                    className="avatar-circle"
                    style={{
                      backgroundColor: otherPlayer.id
                        ? `hsl(${
                            (otherPlayer.id.charCodeAt(0) * 137.5) % 360
                          }, 70%, 60%)`
                        : "#95a5a6",
                    }}
                  >
                    {otherPlayer.name.charAt(0).toUpperCase()}
                  </div>
                  {isTalking && <div className="talking-indicator" />}
                  {isCurrentPlayer && (
                    <div
                      className={`microphone-status ${
                        microphone.error
                          ? "error"
                          : microphone.hasPermission
                          ? "listening"
                          : ""
                      }`}
                    />
                  )}
                </div>

                <div className="player-info">
                  <div className="player-name">
                    {otherPlayer.name}
                    {isCurrentPlayer && (
                      <span className="current-player-badge">Tú</span>
                    )}
                    {isTalking && (
                      <span className="speaking-text">hablando...</span>
                    )}
                  </div>

                  <div className="audio-controls">
                    <span
                      className="volume-icon"
                      style={{
                        color:
                          isCurrentPlayer && isTalking
                            ? "#23d160"
                            : getVolumeColor(proximity.audioVolume),
                      }}
                    >
                      {isCurrentPlayer
                        ? "🎤"
                        : getVolumeIcon(proximity.audioVolume)}
                    </span>

                    <div className="volume-bar">
                      <div
                        className="volume-fill"
                        style={{
                          width: `${volumePercentage}%`,
                          backgroundColor:
                            isCurrentPlayer && isTalking
                              ? "#23d160"
                              : getVolumeColor(proximity.audioVolume),
                        }}
                      />
                    </div>

                    <span className="volume-text">
                      {isCurrentPlayer
                        ? isTalking
                          ? "🎤 Hablando"
                          : microphone.hasPermission
                          ? `Mic ${Math.round(microphone.volume * 100)}%`
                          : "Mic"
                        : `${volumePercentage}%`}
                    </span>
                  </div>

                  {debugEnabled && (
                    <div className="debug-info">
                      <small>
                        {isCurrentPlayer
                          ? `Mic: ${Math.round(microphone.volume * 100)}% | ${
                              microphone.hasPermission ? "✅" : "❌"
                            }`
                          : `Distancia: ${Math.round(proximity.distance)}px`}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {debugEnabled && (
        <div className="voice-debug">
          <small>
            🐛 Total jugadores: {Object.keys(otherPlayers).length} | En rango:{" "}
            {playersInRange.length} | Incluyendo tú: {allVisiblePlayers.length}
            {microphone.error && (
              <>
                <br />
                <span style={{ color: "#e74c3c" }}>
                  🎤 Error: {microphone.error}
                </span>
              </>
            )}
          </small>
        </div>
      )}
    </div>
  );
};

export default VoiceChat;
