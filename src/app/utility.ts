import { Direction, Location, Dimensions, Snake } from './types';

export const FRUIT_SIZE: Dimensions = {
  width: 15,
  height: 15
};

export const SEGMENT_SIZE: Dimensions = {
  width: 25,
  height: 25
};

export const NEW_SEGMENT_COUNT = 2;

export const TILE_COUNT = 25;

export const fruitSpawnRate = 2000;

export const fruitSpawnCap = 5;

export const playerMovementRate = 40;

export function getRandomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getCardinalsFromDirection(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return { x: 0, y: -1 };
    case Direction.Right:
      return { x: 1, y: 0 };
    case Direction.Down:
      return { x: 0, y: 1 };
    case Direction.Left:
      return { x: -1, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

export function getOppositeCardinalFromDirection(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return { x: 0, y: 1 };
    case Direction.Right:
      return { x: -1, y: 0 };
    case Direction.Down:
      return { x: 0, y: -1 };
    case Direction.Left:
      return { x: 1, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

export function getOppositeDirection(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Right:
      return Direction.Left;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    default:
      return 0;
  }
}

export function areEqualLocations(loc1: Location, loc2: Location) {
  return (loc1.x === loc2.x && loc1.y === loc2.y);
}

export function moveSnake(state: Snake) {
  const spliced_turns = [...state.turns];
  const new_segments = state.segments.map((seg, index) => {
    let new_seg;
    let direction;
    let x;
    for (x = 0; x < spliced_turns.length; x++) {
      if (areEqualLocations(spliced_turns[x].location, seg.location)) {
        direction = spliced_turns[x].direction;
        break;
      }
    }
    if (direction !== undefined && index === state.segments.length - 1) {
      spliced_turns.pop();
    }
    direction = direction !== undefined ? direction : seg.direction;
    const seg_cardinals = getCardinalsFromDirection(direction);
    new_seg =  {
      location: { x: seg.location.x + seg_cardinals.x, y: seg.location.y + seg_cardinals.y },
      direction
    };
    return new_seg;
  });
  return {
    ...state,
    segments: new_segments,
    turns: spliced_turns
  };
}
