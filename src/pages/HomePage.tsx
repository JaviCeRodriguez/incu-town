import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import type { PageProps } from "../types/game";

const HomePage: React.FC<PageProps> = ({ onJoinGame }) => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const setRoomIdStore = useGameStore((state) => state.setRoomId);

  const handleJoinGame = () => {
    if (!playerName.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }

    // Actualizar el nombre del jugador en el store
    useGameStore.setState((state) => ({
      player: {
        ...state.player,
        name: playerName,
      },
    }));

    // Establecer roomId en el store
    if (roomId.trim()) {
      setRoomIdStore(roomId);
    } else {
      setRoomIdStore("default-room");
    }

    onJoinGame?.();
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }

    // Generar un ID de sala aleatorio
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Actualizar el nombre del jugador en el store
    useGameStore.setState((state) => ({
      player: {
        ...state.player,
        name: playerName,
      },
    }));

    setRoomIdStore(newRoomId);
    onJoinGame?.();
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Incu Town</h1>
        <p>Un mundo virtual donde puedes conocer y socializar con otros</p>

        <div className="join-form">
          <div className="form-group">
            <label htmlFor="playerName">Tu nombre:</label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ingresa tu nombre"
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label htmlFor="roomId">ID de la sala (opcional):</label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Deja vacío para sala por defecto"
              maxLength={10}
            />
          </div>

          <div className="button-group">
            <button onClick={handleJoinGame} className="join-button">
              Unirse al Juego
            </button>
            <button onClick={handleCreateRoom} className="create-button">
              Crear Nueva Sala
            </button>
          </div>
        </div>

        <div className="features">
          <h3>Características:</h3>
          <ul>
            <li>Muévete libremente por el mundo virtual</li>
            <li>Interactúa con otros jugadores en tiempo real</li>
            <li>Salas privadas para grupos</li>
            <li>Interfaz simple y fácil de usar</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
