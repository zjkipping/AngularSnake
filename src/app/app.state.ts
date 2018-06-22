import { Action } from '@ngrx/store';

import { Snake, Fruit, Meta, Direction, Location, Status, Dimensions, TILE_COUNT, SegmentType } from './types';

export const ATTEMPT_MOVEMENT = 'ATTEMPT_MOVEMENT';
export class AttemptMovementAction implements Action {
  type = ATTEMPT_MOVEMENT;
  constructor(public direction?: Direction) { }
}

export const MOVE_SNAKE = 'MOVE_SNAKE';
export class MoveSnakeAction implements Action {
  type = MOVE_SNAKE;
  constructor(public direction: Direction) { }
}

const defaultSnake: Snake = {
  head: {
    type: SegmentType.HEAD,
    location: { x: 15, y: 15 },
    direction: Direction.Up
  },
  segments: []
};

export function SnakeReducer(state: Snake = defaultSnake, action: Action): Snake {
  switch (action.type) {
    case START_GAME:
    case MOVE_SNAKE:
      return state;
    default:
      return state;
  }
}

export const CREATE_FRUIT = 'CREATE_FRUIT';
export class CreateFruitAction implements Action {
  type = CREATE_FRUIT;
}

export const ADD_FRUIT = 'ADD_FRUIT';
export class AddFruitAction implements Action {
  type = ADD_FRUIT;
  constructor(public location: Location) { }
}

export const EAT_FRUIT = 'EAT_FRUIT';
export class EatFruitAction implements Action {
  type = EAT_FRUIT;
  constructor(public fruit: Fruit) { }
}

export function FruitsReducer(state: Fruit[] = [], action: Action): Fruit[] {
  switch (action.type) {
    case INITIALIZE:
      return [{ location: ((action as InitializeAction).location) }];
    default:
      return state;
  }
}

export const SET_GAME_STATUS = 'SET_GAME_STATUS';
export class SetGameStatusAction implements Action {
  type = SET_GAME_STATUS;
  constructor(public status: Status) { }
}

export const RESIZE_SCREEN = 'RESIZE_SCREEN';
export class ResizeScreenAction implements Action {
  type = RESIZE_SCREEN;
  constructor(public dimensions: Dimensions) { }
}

export const END_GAME = 'END_GAME';
export class EndGameAction implements Action {
  type = END_GAME;
  constructor(public won: boolean) { }
}

const defaultMeta: Meta = {
  status: Status.Loading,
  won: false,
  screenDimensions: { width: 0, height: 0 },
  tileSize: 1
};

export function MetaReducer(state: Meta = defaultMeta, action: Action): Meta {
  switch (action.type) {
    case INITIALIZE:
      let tileSize = calculateTileSize((action as InitializeAction).dimensions);
      return {
        ...state,
        screenDimensions: { width: tileSize * TILE_COUNT, height: tileSize * TILE_COUNT },
        status: Status.Loaded,
        tileSize: tileSize
      };
    case RESIZE_SCREEN:
      tileSize = calculateTileSize((action as ResizeScreenAction).dimensions);
      return { ...state,  tileSize, screenDimensions: { width: tileSize * TILE_COUNT, height: tileSize * TILE_COUNT }};
    default:
      return state;
  }
}

function calculateTileSize(d: Dimensions) {
  const min = Math.min(d.width, d.height);
  const tileSize = (min - (min % TILE_COUNT)) / TILE_COUNT;
  return (tileSize - tileSize % 5);
}

export const KEY_PRESS = 'KEY_PRESS';
export class KeyPressAction implements Action {
  type = KEY_PRESS;
  constructor(public key: string) { }
}

export const INITIALIZE = 'INITIALIZE';
export class InitializeAction implements Action {
  type = INITIALIZE;
  constructor(public dimensions: Dimensions, public location: Location) { }
}

export const START_GAME = 'START_GAME';
export class StartGameAction implements Action {
  type = START_GAME;
  constructor(direction: Direction) { }
}
