export enum Status {
  Loading,
  Loaded,
  Running,
  Paused,
  Ended
}

export interface Meta {
  status: Status;
  won: boolean;
  screenDimensions: Dimensions;
  tileSize: number;
}

export interface Snake {
  segments: Segment[];
  turns: Segment[];
}

export interface Fruit {
  location: Location;
}

export interface Location {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum Direction {
  Up,
  Right,
  Down,
  Left
}

export interface Segment {
  location: Location;
  direction: Direction;
}

export interface Situation {
  gameCtx: CanvasRenderingContext2D;
  screenDimensions: Dimensions;
  snake: Snake;
  fruits: Fruit[];
  status: Status;
  won: boolean;
  tileSize: number;
  elapsedTime: number;
}

export interface GameState {
  snake: Snake;
  fruits: Fruit[];
  meta: Meta;
}
