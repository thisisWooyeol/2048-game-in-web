import type { Cell, Map2048, MoveResult, RotateDegree } from '@/constants';

// Helper functions

/**
 * 2048 게임에서, Map에 랜덤한 위치에 블록을 놓을 수 있는지 확인하고, 가능하다면  랜덤 블록을 추가합니다.
 * @param map Map2048
 * @returns 가능하다면 랜덤한 위치에 블록이 추가된 Map
 */
export const addRandomBlock = (map: Map2048): Map2048 => {
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

export const moveLeft = (map: Map2048): MoveResult => {
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

export const validateMapIsNByM = (map: Map2048): boolean =>
  new Set(map.map((row) => row.length)).size === 1;

export const rotateMapCounterClockwise = (
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
