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
    if (!validateMapIsNByM(map)) throw new Error("Map is not N by M");
  
    const rotatedMap = rotateMapCounterClockwise(map, rotateDegreeMap[direction]);
  
    const { result, isMoved } = moveLeft(rotatedMap);
  
    return {
      result: rotateMapCounterClockwise(result, revertDegreeMap[direction]),
      isMoved,
    };
  };
  
  const validateMapIsNByM = (map: Map2048) => {
    const firstColumnCount = map[0].length;
    return map.every((row) => row.length === firstColumnCount);
  };
  
  const rotateMapCounterClockwise = (
    map: Map2048,
    degree: 0 | 90 | 180 | 270,
  ): Map2048 => {
    const rowLength = map.length;
    const columnLength = map[0].length;
  
    switch (degree) {
      case 0:
        return map;
      case 90:
        return Array.from({ length: columnLength }, (_, columnIndex) =>
          Array.from(
            { length: rowLength },
            (_, rowIndex) => map[rowIndex]?.[columnLength - columnIndex - 1] ?? null,
          ),
        );
      case 180:
        return Array.from({ length: rowLength }, (_, rowIndex) =>
          Array.from(
            { length: columnLength },
            (_, columnIndex) =>
              map[rowLength - rowIndex - 1]?.[columnLength - columnIndex - 1] ?? null,
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
    return { result, isMoved };
  };
  
  const moveRowLeft = (row: Cell[]): { result: Cell[]; isMoved: boolean } => {
    const reduced = row.reduce(
      (acc: { lastCell: Cell; result: Cell[] }, cell) => {
        if (cell === null) {
          return acc;
        } else if (acc.lastCell === null) {
          return { ...acc, lastCell: cell };
        } else if (acc.lastCell === cell) {
          return { result: [...acc.result, cell * 2], lastCell: null };
        } else {
          return { result: [...acc.result, acc.lastCell], lastCell: cell };
        }
      },
      { lastCell: null, result: [] },
    );
  
    const result = [...reduced.result, reduced.lastCell];
    const resultRow = Array.from(
      { length: row.length },
      (_, i) => result[i] ?? null,
    );
  
    return {
      result: resultRow,
      isMoved: row.some((cell, i) => cell !== resultRow[i]),
    };
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
  
  type Cell = number | null;
  export type Map2048 = Cell[][];
  type Direction = "up" | "left" | "right" | "down";
  type RotateDegree = 0 | 90 | 180 | 270;
  type DirectionDegreeMap = Record<Direction, RotateDegree>;
  type MoveResult = { result: Map2048; isMoved: boolean };

/**
 * 2048 게임에서, Map을 초기화하는 함수입니다.
 * @param rowLength Map의 행 길이
 * @param columnLength Map의 열 길이
 * @returns columnLength * rowLength 크기의 2048 게임 Map
 */
export const resetMap = (rowLength: number, columnLength: number) : Map2048 => {
  const initPos: number[] = getRandomInitPos(rowLength, columnLength);
  return Array.from({ length: rowLength }, (_, rowIndex) =>
    Array.from(
      { length: columnLength },
      (_, columnIndex) => {
        return initPos.some(pos => 
          pos === rowIndex * rowLength + columnIndex) ? 2 : null;
      },
    ),
  );
};

/**
 * 2048 게임에서, Map의 2개의 초기 블록 위치를 반환하는 함수입니다.
 * @param rowLength Map의 행 길이
 * @param columnLength Map의 열 길이
 * @returns (0, ... , rowLength * columnLength - 1)의 배열
 */
export const getRandomInitPos = (rowLength: number, columnLength: number): number[] => {
  const firstPosition: number = Math.floor(Math.random() * rowLength * columnLength);
  let tmp: number;
  do {
    tmp = Math.floor(Math.random() * rowLength * columnLength);
  } while (firstPosition === tmp);
  const secondPosition: number = tmp;

  return [firstPosition, secondPosition];
};

/**
 * 2048 게임에서, Map에 랜덤한 위치에 블록을 놓을 수 있는지 확인하고, 가능하다면 랜덤한 위치를 반환하는 함수입니다.
 * @param map Map2048
 * @returns 신규 블록을 놓을 수 있는 랜덤한 위치 (0, rowLength * columnLength -1) 범위의 number 또는 null
 */
export const getRandomPos = (map: Map2048): number | null => {
  const rowLength = map.length;
  const emptyPositions: number[] = [];
  map.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === null) {
        emptyPositions.push(rowIndex * rowLength + columnIndex);
      }
    });
  });
  if (emptyPositions.length === 0) {
    return null;
  }

  const randomIndex: number = Math.floor(Math.random() * emptyPositions.length);
  return emptyPositions[randomIndex] ?? null;
}

export const stringDirectionMap: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowLeft: 'left',
};

export const isGameWin = (map: Map2048): boolean => {
  const WINNING_SCORE = 128;
  return map.some(row => row.some(cell => cell === WINNING_SCORE));
}

export const isGameLose = (map: Map2048): boolean => {
  const isFull = map.every(row => row.every(cell => cell !== null));
  if (!isFull) return false;

  const isMovable = Object.values(stringDirectionMap).some(direction => {
    const { isMoved } = moveMapIn2048Rule(map, direction);
    return isMoved;
  });
  return !isMovable;
}