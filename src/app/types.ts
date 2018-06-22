export const FRUIT_SIZE: Dimensions = {
  width: 15,
  height: 15
};

export const SEGMENT_SIZE: Dimensions = {
  width: 25,
  height: 25
};

export const TILE_COUNT = 31;

export const fruitSpawnRate = 2000;

export const fruitSpawnCap = 5;

export const playerMovementRate = 60;

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
  head: Segment;
  segments: Segment[];
}

export interface Fruit {
  location: Location;
}

export enum SegmentType {
  'HEAD',
  'BODY',
  'TURN'
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
  type: SegmentType;
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
