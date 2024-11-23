export type Cell = number | null;
export type Map2048 = Cell[][];

export enum Direction {
  Up,
  Right,
  Down,
  Left,
}

export type RotateDegree = 0 | 90 | 180 | 270;
type DirectionDegreeMap = Record<Direction, RotateDegree>;

export const rotateDegreeMap: DirectionDegreeMap = {
  [Direction.Up]: 90,
  [Direction.Right]: 180,
  [Direction.Down]: 270,
  [Direction.Left]: 0,
};

export const revertDegreeMap: DirectionDegreeMap = {
  [Direction.Up]: 270,
  [Direction.Right]: 180,
  [Direction.Down]: 90,
  [Direction.Left]: 0,
};

export const stringDirectionMap: Record<string, Direction> = {
  ArrowUp: Direction.Up,
  ArrowRight: Direction.Right,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  w: Direction.Up,
  d: Direction.Right,
  s: Direction.Down,
  a: Direction.Left,
};

export type MoveResult = {
  result: Map2048;
  isMoved: boolean;
  newPoints: number;
};

export type State2048 = {
  map: Map2048;
  score: number;
  bestScore: number;
  gameStatus: 'playing' | 'win' | 'lose';
};
