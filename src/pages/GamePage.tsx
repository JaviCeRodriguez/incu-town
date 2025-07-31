import React from "react";
import { useGameStore } from "../store/gameStore";
import GameCanvas from "../components/GameCanvas";
import type { PageProps } from "../types/game";

const GamePage: React.FC<PageProps> = ({ onLeaveGame }) => {
  const player = useGameStore((state) => state.player);
  const roomId = useGameStore((state) => state.gameState.roomId);
  const isConnected = useGameStore((state) => state.gameState.isConnected);

  return (
    <div className="game-page">
      <header className="game-header">
        <div className="game-info">
          <h2>Incu Town</h2>
          <div className="player-info">
            <span>Jugador: {player.name}</span>
            <span>Sala: {roomId}</span>
            <span
              className={`status ${isConnected ? "connected" : "disconnected"}`}
            >
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
          </div>
        </div>
        <button onClick={() => onLeaveGame?.()} className="leave-button">
          Salir del Juego
        </button>
      </header>

      <main className="game-main">
        <GameCanvas />
      </main>

      <footer className="game-footer">
        <p>Usa las flechas o WASD para moverte por el mundo</p>
      </footer>
    </div>
  );
};

export default GamePage;
