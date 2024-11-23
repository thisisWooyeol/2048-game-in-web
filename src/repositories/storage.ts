import type { Map2048, State2048 } from '@/constants';

type Storage2048 = {
  loadGameState: () => State2048 | undefined;
  saveGameState: (state: State2048) => void;
};

export const getStorage2048 = (): Storage2048 => ({
  loadGameState: () => {
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
  },
  saveGameState: (state: State2048) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('gameState', serializedState);
    } catch (err) {
      console.error('Failed to save game state to localStorage:', err);
    }
  },
});
