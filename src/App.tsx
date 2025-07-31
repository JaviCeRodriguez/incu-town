import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import "./App.css";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"home" | "game">("home");

  const handleJoinGame = () => {
    setCurrentPage("game");
  };

  const handleLeaveGame = () => {
    setCurrentPage("home");
  };

  return (
    <div className="app">
      {currentPage === "home" && <HomePage onJoinGame={handleJoinGame} />}
      {currentPage === "game" && <GamePage onLeaveGame={handleLeaveGame} />}
    </div>
  );
};

export default App;
