import {
  Direction,
  type Map2048,
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
  move: (state: State2048, direction: Direction) => State2048;
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
      const rotatedMap = rotateMapCounterClockwise(
        map,
        rotateDegreeMap[direction],
      );
      const { isMoved } = moveLeft(rotatedMap);
      return isMoved;
    });
    return !isMovable;
  };

  const move = (state: State2048, direction: Direction): State2048 => {
    if (!validateMapIsNByM(state.map)) throw new Error('Map is not N by M');

    const rotatedMap = rotateMapCounterClockwise(
      state.map,
      rotateDegreeMap[direction],
    );
    const { map: result, isMoved, newPoints } = moveLeft(rotatedMap);
    const resultMap = rotateMapCounterClockwise(
      result,
      revertDegreeMap[direction],
    );

    const updatedMap = isMoved ? addRandomBlock(resultMap) : resultMap;
    const newScore = state.score + newPoints;
    const bestScore = Math.max(state.bestScore, newScore);

    const isWin = isGameWin(updatedMap);
    const isLose = isGameLose(updatedMap);
    const newGameStatus = isWin ? 'win' : isLose ? 'lose' : 'playing';

    return {
      map: updatedMap,
      score: newScore,
      bestScore: bestScore,
      gameStatus: newGameStatus,
    };
  };

  return {
    resetGame,
    isGameWin,
    isGameLose,
    move,
  };
};
