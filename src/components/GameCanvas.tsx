import React, { useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { useGameStore } from "../store/gameStore";
import { useKeyboard } from "../hooks/useKeyboard";
import { useGameLoop } from "../hooks/useGameLoop";
import { GAME_CONFIG } from "../constants/gameConstants";
import World from "./World";
import Player from "./Player";
import PlayerSpawner from "./PlayerSpawner";
import CollisionDebug from "./CollisionDebug";

const GameCanvas: React.FC = () => {
  const player = useGameStore((state) => state.player);
  const otherPlayers = useGameStore((state) => state.otherPlayers);
  const setGameLoaded = useGameStore((state) => state.setGameLoaded);

  // Inicializar hooks del juego
  useKeyboard();
  useGameLoop();

  useEffect(() => {
    // Marcar el juego como cargado
    setGameLoaded(true);

    return () => {
      setGameLoaded(false);
    };
  }, [setGameLoaded]);

  return (
    <div className="game-container">
      {/* Spawner de jugadores de prueba */}
      <PlayerSpawner />

      <Stage
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
      >
        <Layer>
          {/* Renderizar el mundo */}
          <World />

          {/* Renderizar el jugador actual */}
          <Player player={player} isCurrentPlayer={true} />

          {/* Renderizar otros jugadores */}
          {Object.entries(otherPlayers).map(([playerId, playerData]) => (
            <Player
              key={playerId}
              player={playerData}
              isCurrentPlayer={false}
            />
          ))}

          {/* Debug de colisiones (activado con D) */}
          <CollisionDebug enabled={true} />
        </Layer>
      </Stage>

      {/* UI del juego */}
      <div className="game-ui">
        <div className="controls-help">
          <h3>Controles:</h3>
          <p>Usa las flechas o WASD para moverte</p>
          <p>
            Posición: ({Math.round(player.x)}, {Math.round(player.y)})
          </p>
          <p>Estado: {player.state}</p>
          <p>Dirección: {player.direction}</p>
          <hr style={{ margin: "10px 0", opacity: 0.3 }} />
          <h4>Sistema de Colisiones:</h4>
          <p style={{ fontSize: "0.8rem", color: "#888" }}>
            Línea roja: Hitbox del jugador
            <br />
            Cuadro amarillo: Tile actual
            <br />
            Intenta caminar hacia las paredes grises
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
