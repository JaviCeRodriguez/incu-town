import React, { useState, useEffect } from "react";
import { Rect, Circle, Group } from "react-konva";
import type { Direction, PlayerState } from "../types/game";

interface AnimatedSpriteProps {
  x: number;
  y: number;
  direction: Direction;
  state: PlayerState;
  playerColor?: string;
}

const AnimatedSprite: React.FC<AnimatedSpriteProps> = ({
  x,
  y,
  direction,
  state,
  playerColor = "#4A90E2",
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Animación simple - cambiar frame cada 200ms cuando está caminando
  useEffect(() => {
    if (state === "walking") {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % 4);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setCurrentFrame(0);
    }
  }, [state]);

  // Por ahora usamos formas simples pero animadas
  const getBodyOffset = () => {
    if (state === "walking") {
      return currentFrame % 2 === 0 ? 0 : 1; // Movimiento sutil
    }
    return 0;
  };

  const getRotation = () => {
    switch (direction) {
      case "up":
        return 0;
      case "down":
        return 0;
      case "left":
        return -5; // Leve inclinación
      case "right":
        return 5;
      default:
        return 0;
    }
  };

  return (
    <Group x={x} y={y} rotation={getRotation()}>
      {/* Sombra */}
      <Group opacity={0.3} x={2} y={2 + getBodyOffset()}>
        {/* Cabeza - sombra */}
        <Circle x={12} y={6} radius={4} fill="#000" />
        {/* Cuerpo - sombra */}
        <Rect
          x={6}
          y={12}
          width={12}
          height={14}
          fill="#000"
          cornerRadius={2}
        />
      </Group>

      {/* Sprite principal */}
      <Group y={getBodyOffset()}>
        {/* Cabeza */}
        <Circle x={12} y={6} radius={4} fill="#FFB88C" />

        {/* Pelo */}
        <Circle x={12} y={4} radius={3} fill="#8B4513" />

        {/* Ojos */}
        <Circle x={10} y={5} radius={0.5} fill="#333" />
        <Circle x={14} y={5} radius={0.5} fill="#333" />

        {/* Sonrisa */}
        {state === "walking" && (
          <Rect
            x={11}
            y={7}
            width={2}
            height={0.5}
            fill="#333"
            cornerRadius={0.5}
          />
        )}

        {/* Cuerpo */}
        <Rect
          x={6}
          y={12}
          width={12}
          height={14}
          fill={playerColor}
          cornerRadius={2}
        />

        {/* Brazos */}
        <Rect
          x={direction === "left" ? 2 : 4}
          y={14}
          width={3}
          height={8}
          fill="#FFB88C"
          cornerRadius={1}
        />
        <Rect
          x={direction === "right" ? 19 : 17}
          y={14}
          width={3}
          height={8}
          fill="#FFB88C"
          cornerRadius={1}
        />

        {/* Piernas con animación de caminar */}
        <Rect
          x={8}
          y={26}
          width={3}
          height={6}
          fill="#333"
          cornerRadius={1}
          offsetY={state === "walking" && currentFrame % 2 === 0 ? 1 : 0}
        />
        <Rect
          x={13}
          y={26}
          width={3}
          height={6}
          fill="#333"
          cornerRadius={1}
          offsetY={state === "walking" && currentFrame % 2 === 1 ? 1 : 0}
        />
      </Group>

      {/* Indicador de dirección mejorado */}
      {state === "walking" && (
        <Circle
          x={direction === "left" ? 4 : direction === "right" ? 20 : 12}
          y={direction === "up" ? 2 : direction === "down" ? 30 : 16}
          radius={2}
          fill="#FFF"
          opacity={0.8}
        />
      )}
    </Group>
  );
};

export default AnimatedSprite;
