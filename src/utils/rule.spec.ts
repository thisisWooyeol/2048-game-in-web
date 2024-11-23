import { describe, expect, test } from 'vitest';

import { Direction, type Map2048, type State2048 } from '@/constants';
import { getRule2048 } from '@/utils/rule';

describe('rule.ts functions', () => {
  const NUM_ROWS = 4;
  const NUM_COLS = 4;
  const WINNING_SCORE = 2048;

  const { resetGame, move } = getRule2048({
    NUM_ROWS,
    NUM_COLS,
    WINNING_SCORE,
  });

  describe('resetGame', () => {
    test('should initialize the game state correctly', () => {
      const initialState = resetGame();
      expect(initialState.map.length).toBe(NUM_ROWS);
      initialState.map.forEach((row) => {
        expect(row.length).toBe(NUM_COLS);
      });
      const nonNullCells = initialState.map
        .flat()
        .filter((cell) => cell !== null);
      expect(nonNullCells.length).toBe(2);
      expect(initialState.score).toBe(0);
      expect(initialState.bestScore).toBe(0);
      expect(initialState.gameStatus).toBe('playing');
    });
  });

  describe('move', () => {
    describe('valid move for 4 directions', () => {
      test('should perform a valid move in direction Up', () => {
        const state: State2048 = {
          map: [
            [2, null, null, null],
            [2, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
          ],
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        const newState = move(state, Direction.Up);
        expect(newState.score).toBe(4);
        expect(newState.bestScore).toBe(4);
        expect(newState.map[0]?.[0]).toBe(4);
        const nonNullCells = newState.map
          .flat()
          .filter((cell) => cell !== null);
        expect(nonNullCells.length).toBe(2); // One merged tile + one new random tile
      });

      test('should perform a valid move in direction Right', () => {
        const state: State2048 = {
          map: [
            [2, 2, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
          ],
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        const newState = move(state, Direction.Right);
        expect(newState.score).toBe(4);
        expect(newState.bestScore).toBe(4);
        expect(newState.map[0]?.[3]).toBe(4);
        const nonNullCells = newState.map
          .flat()
          .filter((cell) => cell !== null);
        expect(nonNullCells.length).toBe(2); // One merged tile + one new random tile
      });

      test('should perform a valid move in direction Down', () => {
        const state: State2048 = {
          map: [
            [null, null, null, null],
            [null, null, null, null],
            [2, null, null, null],
            [2, null, null, null],
          ],
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        const newState = move(state, Direction.Down);
        expect(newState.score).toBe(4);
        expect(newState.bestScore).toBe(4);
        expect(newState.map[3]?.[0]).toBe(4);
        const nonNullCells = newState.map
          .flat()
          .filter((cell) => cell !== null);
        expect(nonNullCells.length).toBe(2); // One merged tile + one new random tile
      });

      test('should perform a valid move in direction Left', () => {
        const state: State2048 = {
          map: [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, 2],
            [null, null, null, 2],
          ],
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        const newState = move(state, Direction.Left);
        expect(newState.score).toBe(0);
        expect(newState.bestScore).toBe(0);
        expect(newState.map[2]?.[0]).toBe(2);
        expect(newState.map[3]?.[0]).toBe(2);
        const nonNullCells = newState.map
          .flat()
          .filter((cell) => cell !== null);
        expect(nonNullCells.length).toBe(3); // One merged tile + one new random tile
      });
    });

    describe('if blocks cannot move', () => {
      test('should lose when board is full and map does not change', () => {
        const state: State2048 = {
          map: [
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 2],
          ],
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        const newState = move(state, Direction.Left);
        expect(newState.map).toEqual(state.map);
        expect(newState.gameStatus).toBe('lose');
      });

      test('should keep playing when board has empty cells and map does not change', () => {
        const state: State2048 = {
          map: [
            [2, null, null, null],
            [2, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
          ],
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        const newState = move(state, Direction.Left);
        expect(newState.map).toEqual(state.map);
        expect(newState.gameStatus).toBe('playing');
      });
    });

    describe('gameStatus check', () => {
      test('should set gameStatus to "win" when WINNING_SCORE is reached', () => {
        const winningMap: Map2048 = [
          [WINNING_SCORE / 2, WINNING_SCORE / 2, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ];
        const state: State2048 = {
          map: winningMap,
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        const newState = move(state, Direction.Left);
        expect(newState.gameStatus).toBe('win');
      });

      test('should set gameStatus to "lose" when no moves are possible after move', () => {
        const noMoveMap: Map2048 = [
          [2, 4, 2, 4],
          [4, 2, 4, 8],
          [2, 8, 2, 4],
          [4, 2, 4, 2],
        ];
        const state: State2048 = {
          map: noMoveMap,
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        const newState = move(state, Direction.Left);
        expect(newState.gameStatus).toBe('lose');
      });
    });

    describe('invalid map', () => {
      test('should throw an error if the map is invalid', () => {
        const invalidMap: Map2048 = [
          [2, 2, null],
          [null, null],
          [null, null, null, null],
        ];
        const state: State2048 = {
          map: invalidMap,
          score: 0,
          bestScore: 0,
          gameStatus: 'playing',
        };
        expect(() => move(state, Direction.Left)).toThrow('Map is not N by M');
      });
    });
  });
});
