import {
  Direction,
  type Map2048,
  type MoveResult,
  revertDegreeMap,
  rotateDegreeMap,
  type State2048,
} from '@/constants';
import {
  addRandomBlock,
  moveLeft,
  rotateMapCounterClockwise,
  validateMapIsNByM,
} from '@/utils/helpers';

type GetRule2048Props = {
  NUM_ROWS: number;
  NUM_COLS: number;
  WINNING_SCORE: number;
};

type Rule2048 = {
  resetGame: () => State2048;
  isGameWin: (map: Map2048) => boolean;
  isGameLose: (map: Map2048) => boolean;
  move: (map: Map2048, direction: Direction) => MoveResult;
};

export const getRule2048 = ({
  NUM_ROWS,
  NUM_COLS,
  WINNING_SCORE,
}: GetRule2048Props): Rule2048 => {
  const resetGame = (): State2048 => {
    const map: Map2048 = Array.from({ length: NUM_ROWS }, () => {
      return Array.from({ length: NUM_COLS }, () => null);
    });
    const initialMap = addRandomBlock(addRandomBlock(map));
    return {
      map: initialMap,
      score: 0,
      bestScore: 0,
      gameStatus: 'playing',
    };
  };

  const isGameWin = (map: Map2048): boolean => {
    return map.some((row) => row.some((cell) => cell === WINNING_SCORE));
  };

  const isGameLose = (map: Map2048): boolean => {
    const isFull = map.every((row) => row.every((cell) => cell !== null));
    if (!isFull) return false;

    const isMovable = [
      Direction.Up,
      Direction.Right,
      Direction.Down,
      Direction.Left,
    ].some((direction) => {
      const { isMoved } = move(map, direction);
      return isMoved;
    });

    return !isMovable;
  };

  const move = (map: Map2048, direction: Direction): MoveResult => {
    if (!validateMapIsNByM(map)) throw new Error('Map is not N by M');

    const rotatedMap = rotateMapCounterClockwise(
      map,
      rotateDegreeMap[direction],
    );
    const { map: result, isMoved, newPoints } = moveLeft(rotatedMap);
    const resultMap = rotateMapCounterClockwise(
      result,
      revertDegreeMap[direction],
    );

    return {
      map: isMoved ? addRandomBlock(resultMap) : resultMap,
      isMoved,
      newPoints,
    };
  };

  return {
    resetGame,
    isGameWin,
    isGameLose,
    move,
  };
};
