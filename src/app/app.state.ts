import { Action } from '@ngrx/store';

import { Snake, Fruit, Meta, Direction, Location, Status, Dimensions } from './types';
import {
  areEqualLocations,
  TILE_COUNT,
  moveSnake,
  getOppositeCardinalFromDirection,
  NEW_SEGMENT_COUNT,
  getOppositeDirection
} from './utility';

export const CHANGE_DIRECTION = 'CHANGE_DIRECTION';
export class ChangeDirectionAction implements Action {
  type = CHANGE_DIRECTION;
  constructor(public direction: Direction) { }
}

export const ATTEMPT_MOVEMENT = 'ATTEMPT_MOVEMENT';
export class AttemptMovementAction implements Action {
  type = ATTEMPT_MOVEMENT;
  constructor() { }
}

export const MOVE_SNAKE = 'MOVE_SNAKE';
export class MoveSnakeAction implements Action {
  type = MOVE_SNAKE;
  constructor() { }
}

const defaultSnake: Snake = {
  segments: [{
    location: { x: Math.floor(TILE_COUNT / 2), y: Math.floor(TILE_COUNT / 2) },
    direction: 0
  }],
  turns: []
};

export function SnakeReducer(state: Snake = defaultSnake, action: Action): Snake {
  switch (action.type) {
    case START_GAME:
    case CHANGE_DIRECTION:
      if (state.segments.length === 1 ||
      (action as ChangeDirectionAction).direction !== getOppositeDirection(state.segments[0].direction)) {
        if (state.turns.length > 0 && areEqualLocations(state.turns[0].location, state.segments[0].location)) {
          const new_turns = [...state.turns];
          new_turns[0].direction = (action as ChangeDirectionAction).direction;
          return { ...state, turns: new_turns };
        } else {
          const new_turn = {
            location: state.segments[0].location,
            direction: (action as ChangeDirectionAction).direction
          };
          return { ...state, turns: [new_turn].concat(state.turns) };
        }
      } else {
        return state;
      }
    case EAT_FRUIT:
      const new_segments = [...state.segments];
      const cardinals = getOppositeCardinalFromDirection(state.segments[state.segments.length - 1].direction);
      for (let x = 1; x <= NEW_SEGMENT_COUNT; x++) {
        new_segments.push({
          location: {
            x: state.segments[state.segments.length - 1].location.x + (cardinals.x * x),
            y: state.segments[state.segments.length - 1].location.y + (cardinals.y * x)
          },
          direction: state.segments[state.segments.length - 1].direction
        });
      }
      return moveSnake({ ...state, segments: new_segments });
    case MOVE_SNAKE:
      return moveSnake(state);
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
    case ADD_FRUIT:
      return [...state,  { location: (action as AddFruitAction).location }];
    case EAT_FRUIT:
      const new_state = [...state];
      const index = state.findIndex((f) => areEqualLocations(f.location, (action as EatFruitAction).fruit.location));
      new_state.splice(index, 1);
      return new_state;
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
      const tileSize = calculateTileSize((action as InitializeAction).dimensions);
      return {
        ...state,
        screenDimensions: { width: tileSize * TILE_COUNT, height: tileSize * TILE_COUNT },
        status: Status.Loaded,
        tileSize
      };
    case START_GAME:
      return { ...state, status: Status.Running };
    case END_GAME:
      return { ...state, status: Status.Ended, won: (action as EndGameAction).won };
    case RESTART_GAME:
      return { ...state, status: Status.Loaded, won: false };
    case RESIZE_SCREEN:
      const tileSize2 = calculateTileSize((action as ResizeScreenAction).dimensions);
      return { ...state,  tileSize: tileSize2, screenDimensions: { width: tileSize2 * TILE_COUNT, height: tileSize2 * TILE_COUNT }};
    case SET_GAME_STATUS:
      return { ...state, status: (action as SetGameStatusAction).status };
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
  constructor(public direction: Direction) { }
}

export const RESTART_GAME = 'RESTART_GAME';
export class RestartGameAction implements Action {
  type = RESTART_GAME;
}
