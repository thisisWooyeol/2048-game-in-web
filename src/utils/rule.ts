import {
  type Cell,
  Direction,
  type Map2048,
  type MoveResult,
  revertDegreeMap,
  type RotateDegree,
  rotateDegreeMap,
  type State2048,
} from '@/constants';

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

// Helper functions

/**
 * 2048 게임에서, Map에 랜덤한 위치에 블록을 놓을 수 있는지 확인하고, 가능하다면  랜덤 블록을 추가합니다.
 * @param map Map2048
 * @returns 가능하다면 랜덤한 위치에 블록이 추가된 Map
 */
const addRandomBlock = (map: Map2048): Map2048 => {
  const emptyCells = map
    .flatMap((row, rowIndex) =>
      row.map((cell, colIndex) =>
        cell === null ? { rowIndex, colIndex } : null,
      ),
    )
    .filter(Boolean) as { rowIndex: number; colIndex: number }[];

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  if (randomCell === undefined) return map;
  const { rowIndex, colIndex } = randomCell;

  return map.map((row, rIdx) =>
    row.map((cell, cIdx) =>
      rIdx === rowIndex && cIdx === colIndex ? 2 : cell,
    ),
  );
};

const moveLeft = (map: Map2048): MoveResult => {
  const movedRows = map.map(moveRowLeft);
  const result = movedRows.map((movedRow) => movedRow.result);
  const isMoved = movedRows.some((movedRow) => movedRow.isMoved);
  const newPoints = movedRows.reduce((acc, row) => acc + row.newPoints, 0);
  return { map: result, isMoved, newPoints };
};

const moveRowLeft = (
  row: Cell[],
): { result: Cell[]; isMoved: boolean; newPoints: number } => {
  const reduced = row.reduce(
    (acc: { newPoints: number; lastCell: Cell; result: Cell[] }, cell) => {
      if (cell === null) {
        return acc;
      } else if (acc.lastCell === null) {
        return { ...acc, lastCell: cell };
      } else if (acc.lastCell === cell) {
        return {
          result: [...acc.result, cell * 2],
          lastCell: null,
          newPoints: acc.newPoints + cell * 2,
        };
      } else {
        return {
          result: [...acc.result, acc.lastCell],
          lastCell: cell,
          newPoints: acc.newPoints,
        };
      }
    },
    { newPoints: 0, lastCell: null, result: [] },
  );

  const result = [...reduced.result, reduced.lastCell];
  const resultRow = Array.from(
    { length: row.length },
    (_, i) => result[i] ?? null,
  );

  return {
    result: resultRow,
    isMoved: row.some((cell, i) => cell !== resultRow[i]),
    newPoints: reduced.newPoints,
  };
};

const validateMapIsNByM = (map: Map2048) =>
  new Set(map.map((row) => row.length)).size === 1;

const rotateMapCounterClockwise = (
  map: Map2048,
  degree: RotateDegree,
): Map2048 => {
  const rowLength = map.length;
  const columnLength = map[0]?.length ?? 0;
  if (rowLength === 0 || columnLength === 0) return map;

  switch (degree) {
    case 0:
      return map;
    case 90:
      return Array.from({ length: columnLength }, (_, columnIndex) =>
        Array.from(
          { length: rowLength },
          (_, rowIndex) =>
            map[rowIndex]?.[columnLength - columnIndex - 1] ?? null,
        ),
      );
    case 180:
      return Array.from({ length: rowLength }, (_, rowIndex) =>
        Array.from(
          { length: columnLength },
          (_, columnIndex) =>
            map[rowLength - rowIndex - 1]?.[columnLength - columnIndex - 1] ??
            null,
        ),
      );
    case 270:
      return Array.from({ length: columnLength }, (_, columnIndex) =>
        Array.from(
          { length: rowLength },
          (_, rowIndex) => map[rowLength - rowIndex - 1]?.[columnIndex] ?? null,
        ),
      );
  }
};
