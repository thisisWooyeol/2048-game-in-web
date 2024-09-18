type Cell = number | null;
export type Map2048 = Cell[][];
type Direction = 'up' | 'left' | 'right' | 'down';
type RotateDegree = 0 | 90 | 180 | 270;
type DirectionDegreeMap = Record<Direction, RotateDegree>;
type MoveResult = {
  result: Map2048;
  isMoved: boolean;
  newPoints: number;
};

const rotateDegreeMap: DirectionDegreeMap = {
  up: 90,
  right: 180,
  down: 270,
  left: 0,
};

const revertDegreeMap: DirectionDegreeMap = {
  up: 270,
  right: 180,
  down: 90,
  left: 0,
};

export const stringDirectionMap: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  w: 'up',
  d: 'right',
  s: 'down',
  a: 'left',
};

const validateMapIsNByM = (map: Map2048) => {
  const firstColumnCount = map[0]?.length;
  return map.every((row) => row.length === firstColumnCount);
};

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

const moveLeft = (map: Map2048): MoveResult => {
  const movedRows = map.map(moveRowLeft);
  const result = movedRows.map((movedRow) => movedRow.result);
  const isMoved = movedRows.some((movedRow) => movedRow.isMoved);
  const newPoints = movedRows.reduce((acc, row) => acc + row.newPoints, 0);
  return { result, isMoved, newPoints };
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

/**
 * 2048 게임에서, Map을 특정 방향으로 이동했을 때 결과를 반환하는 함수입니다.
 * @param map 2048 맵. 빈 공간은 null 입니다.
 * @param direction 이동 방향
 * @returns 이동 방향에 따른 결과와 이동되었는지 여부
 */
export const moveMapIn2048Rule = (
  map: Map2048,
  direction: Direction,
): MoveResult => {
  if (!validateMapIsNByM(map)) throw new Error('Map is not N by M');

  const rotatedMap = rotateMapCounterClockwise(map, rotateDegreeMap[direction]);

  const { result, isMoved, newPoints } = moveLeft(rotatedMap);

  return {
    result: rotateMapCounterClockwise(result, revertDegreeMap[direction]),
    isMoved,
    newPoints,
  };
};

/**
 * 2048 게임에서, Map에 랜덤한 위치에 블록을 놓을 수 있는지 확인하고, 가능하다면  랜덤 블록을 추가합니다.
 * @param map Map2048
 * @returns 가능하다면 랜덤한 위치에 블록이 추가된 Map
 */
export const addRandomBlock = (map: Map2048): Map2048 => {
  const emptyCells: { _row: number; _col: number }[] = [];

  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      cell === null && emptyCells.push({ _row: rowIndex, _col: colIndex });
    });
  });
  if (emptyCells.length === 0) return map;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  if (randomCell === undefined) return map;

  const { _row, _col } = randomCell;
  const updatedMap = map.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      return rowIndex === _row && colIndex === _col ? 2 : cell;
    }),
  );
  return updatedMap;
};

/**
 * 2048 게임에서, Map을 초기화하는 함수입니다.
 * @param rowLength Map의 행 길이
 * @param columnLength Map의 열 길이
 * @returns columnLength * rowLength 크기의 2048 게임 Map
 */
export const resetMap = (rowLength: number, columnLength: number): Map2048 => {
  const map: Map2048 = Array.from({ length: rowLength }, () => {
    return Array.from({ length: columnLength }, () => null);
  });
  return addRandomBlock(addRandomBlock(map));
};

export const isGameWin = (map: Map2048): boolean => {
  const WINNING_SCORE = 128;
  return map.some((row) => row.some((cell) => cell === WINNING_SCORE));
};

export const isGameLose = (map: Map2048): boolean => {
  const isFull = map.every((row) => row.every((cell) => cell !== null));
  if (!isFull) return false;

  const isMovable = Object.values(stringDirectionMap).some((direction) => {
    const { isMoved } = moveMapIn2048Rule(map, direction);
    return isMoved;
  });
  return !isMovable;
};

export const getCellColor = (value: Cell | undefined): string => {
  switch (value) {
    case 2:
      return 'bg-blue-100';
    case 4:
      return 'bg-blue-200';
    case 8:
      return 'bg-green-200';
    case 16:
      return 'bg-green-300';
    case 32:
      return 'bg-yellow-200';
    case 64:
      return 'bg-yellow-300';
    case 128:
      return 'bg-orange-200';
    case 256:
      return 'bg-orange-300';
    case 512:
      return 'bg-red-200';
    case 1024:
      return 'bg-red-300';
    case 2048:
      return 'bg-purple-300';
    default:
      return 'bg-gray-300'; // Default color for empty cells or higher values
  }
};
