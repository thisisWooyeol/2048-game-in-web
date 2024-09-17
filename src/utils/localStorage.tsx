import { type Map2048 } from './Map2048';

export const loadGameState = (): {
  map: Map2048;
  score: number;
  bestScore: number;
  gameStatus: 'playing' | 'win' | 'lose';
} | undefined => {
    try {
      const serializedState = localStorage.getItem('gameState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState) as {
        map: Map2048;
        score: number;
        bestScore: number;
        gameStatus: 'playing' | 'win' | 'lose';
      };
    } catch (err) {
      console.error('Failed to load game state from localStorage:', err);
      return undefined;
    }
  };
  
export const saveGameState = (state: {
  map: Map2048;
  score: number;
  bestScore: number;
  gameStatus: 'playing' | 'win' | 'lose';
}) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('gameState', serializedState);
  } catch (err) {
    console.error('Failed to save game state to localStorage:', err);
  }
};

export const clearGameState = () => {
  try {
    localStorage.removeItem('gameState');
  } catch (err) {
    console.error('Failed to clear game state from localStorage:', err);
  }
};