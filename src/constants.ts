type Cell = number | null;
type Map2048 = Cell[][];

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

const ARROW_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'w',
  'a',
  's',
  'd',
];

type RotateDegree = 0 | 90 | 180 | 270;
type DirectionDegreeMap = Record<Direction, RotateDegree>;

const rotateDegreeMap: DirectionDegreeMap = {
  [Direction.Up]: 90,
  [Direction.Right]: 180,
  [Direction.Down]: 270,
  [Direction.Left]: 0,
};

const revertDegreeMap: DirectionDegreeMap = {
  [Direction.Up]: 270,
  [Direction.Right]: 180,
  [Direction.Down]: 90,
  [Direction.Left]: 0,
};

const stringDirectionMap: Record<string, Direction> = {
  ArrowUp: Direction.Up,
  ArrowRight: Direction.Right,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  w: Direction.Up,
  d: Direction.Right,
  s: Direction.Down,
  a: Direction.Left,
};

type MoveResult = {
  map: Map2048;
  isMoved: boolean;
  newPoints: number;
};

type State2048 = {
  map: Map2048;
  score: number;
  bestScore: number;
  gameStatus: 'playing' | 'win' | 'lose';
};

export type {
  Cell,
  Map2048,
  RotateDegree,
  DirectionDegreeMap,
  MoveResult,
  State2048,
};

export {
  ARROW_KEYS,
  Direction,
  rotateDegreeMap,
  revertDegreeMap,
  stringDirectionMap,
};
