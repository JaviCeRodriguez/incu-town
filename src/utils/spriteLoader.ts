// Utilidad para cargar y manejar sprites
export interface SpriteConfig {
  src: string;
  frameWidth: number;
  frameHeight: number;
  animations: {
    idle: { frames: number[]; speed: number };
    walkUp: { frames: number[]; speed: number };
    walkDown: { frames: number[]; speed: number };
    walkLeft: { frames: number[]; speed: number };
    walkRight: { frames: number[]; speed: number };
  };
}

export const loadSprite = async (
  config: SpriteConfig
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = config.src;
  });
};

export const defaultPlayerSprite: SpriteConfig = {
  src: "/assets/sprites/player-sprite.png",
  frameWidth: 32,
  frameHeight: 32,
  animations: {
    idle: { frames: [0], speed: 1 },
    walkUp: { frames: [0, 1, 2, 3], speed: 8 },
    walkDown: { frames: [4, 5, 6, 7], speed: 8 },
    walkLeft: { frames: [8, 9, 10, 11], speed: 8 },
    walkRight: { frames: [12, 13, 14, 15], speed: 8 },
  },
};
