import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable, Subscription, interval } from 'rxjs';
import { distinctUntilChanged, withLatestFrom, filter, map } from 'rxjs/operators';

import {
  GameState,
  Snake,
  Fruit,
  Dimensions,
  Status,
  Location,
  Direction,
  Segment
} from './types';
import {
  KeyPressAction,
  InitializeAction,
  CreateFruitAction,
  AttemptMovementAction,
  ResizeScreenAction,
  ATTEMPT_MOVEMENT,
  MoveSnakeAction,
  StartGameAction,
  EndGameAction,
  EatFruitAction,
  KEY_PRESS,
  SetGameStatusAction,
  ChangeDirectionAction,
  AddFruitAction,
  CREATE_FRUIT
} from './app.state';
import {
  getRandomRange,
  getCardinalsFromDirection,
  areEqualLocations,
  playerMovementRate,
  fruitSpawnCap,
  fruitSpawnRate,
  TILE_COUNT
} from './utility';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService implements OnDestroy {
  private gameSpots: Location[] = [];
  private lastFruitSpawn =  0;
  private lastPlayerMovement = 0;

  snake: Observable<Snake> = this.store.select(game => game.snake).pipe(distinctUntilChanged());
  fruits: Observable<Fruit[]> = this.store.select(game => game.fruits).pipe(distinctUntilChanged());
  screenDimensions: Observable<Dimensions> = this.store.select(game => game.meta.screenDimensions).pipe(distinctUntilChanged());
  status: Observable<Status> =  this.store.select(game => game.meta.status).pipe(distinctUntilChanged());
  won: Observable<boolean> = this.store.select(game => game.meta.won).pipe(distinctUntilChanged());
  tileSize: Observable<number> = this.store.select(game => game.meta.tileSize).pipe(distinctUntilChanged());
  gameLoop: Subscription;
  elapsedTime = 0;

  @Effect() keyPressed = this.actions.ofType(KEY_PRESS).pipe(
    withLatestFrom(this.status, (action, status) => ({ key: (action as KeyPressAction).key, status })),
    filter(streams => (streams.status !== Status.Loading)),
    map(streams => {
      if (streams.status === Status.Ended) {
        if (streams.key === ' ') {
          window.location.reload();
        }
      } else {
        let direction;
        switch (streams.key) {
          case 'w':
            direction = Direction.Up;
            break;
          case 'd':
            direction = Direction.Right;
            break;
          case 's':
            direction = Direction.Down;
            break;
          case 'a':
            direction = Direction.Left;
            break;
          case ' ':
            return streams.status === Status.Running ? new SetGameStatusAction(Status.Paused) : new SetGameStatusAction(Status.Running);
        }
        if (direction !== undefined) {
          if (streams.status === Status.Loaded) {
            return new StartGameAction(direction);
          } else {
            return new ChangeDirectionAction(direction);
          }
        }
      }
    })
  );

  @Effect() movementAttempt = this.actions.ofType(ATTEMPT_MOVEMENT).pipe(
    withLatestFrom(this.snake, this.fruits, (action, snake, fruits) => ({ action, snake, fruits })),
    map(streams => {
      if (this.checkWallCollisions(streams.snake)) {
        return new EndGameAction(false);
      } else if (this.checkBodyCollisions(streams.snake)) {
        return new EndGameAction(false);
      }
      const fruit = this.checkFruitCollisions(streams.snake, streams.fruits);
      if (fruit) {
        if (streams.fruits.length === 1) {
          this.lastFruitSpawn = this.lastFruitSpawn - fruitSpawnRate;
        }
        return new EatFruitAction(fruit);
      }
      return new MoveSnakeAction();
    })
  );

  @Effect() createFruit = this.actions.ofType(CREATE_FRUIT).pipe(
    withLatestFrom(this.fruits, this.snake, (action, fruits, snake) => ({ fruits, snake })),
    map(streams => {
      const location = this.getRandomFruitLocation(streams.fruits, streams.snake.segments);
      return areEqualLocations(location, { x: -1, y: -1 }) ? new EndGameAction(true) :  new AddFruitAction(location);
    })
  );

  constructor(private store: Store<GameState>, private actions: Actions) {
    for (let x = 0; x < TILE_COUNT; x++) {
      for (let y = 0; y < TILE_COUNT; y++) {
        this.gameSpots.push({ x, y });
      }
    }

    this.gameLoop = interval(1).pipe(
      withLatestFrom(this.store.select(game => game), (num, gameState) => gameState),
      filter(gameState => gameState.meta.status === Status.Running),
      map(gameState => this.updateGame(gameState))
    ).subscribe();
  }

  ngOnDestroy() {
    this.gameLoop.unsubscribe();
  }

  private updateGame(gameState: GameState) {
    this.elapsedTime++;

    if (this.elapsedTime - this.lastFruitSpawn > fruitSpawnRate && gameState.fruits.length < fruitSpawnCap) {
      this.lastFruitSpawn = this.elapsedTime;
      this.createNewFruit();
    }

    if (this.elapsedTime - this.lastPlayerMovement > playerMovementRate) {
      this.lastPlayerMovement = this.elapsedTime;
      this.attemptMovement();
    }
  }

  private checkWallCollisions(snake: Snake): boolean {
    const direction = snake.turns.length > 0 && areEqualLocations(snake.turns[0].location, snake.segments[0].location) ?
      snake.turns[0].direction : snake.segments[0].direction;
    const head_cardinals = getCardinalsFromDirection(direction);
    const x = snake.segments[0].location.x + head_cardinals.x;
    const y = snake.segments[0].location.y + head_cardinals.y;
    return x >= TILE_COUNT || x < 0 || y >= TILE_COUNT || y < 0;
  }

  private checkBodyCollisions(snake: Snake): boolean {
    const direction = snake.turns.length > 0 && areEqualLocations(snake.turns[0].location, snake.segments[0].location) ?
      snake.turns[0].direction : snake.segments[0].direction;
    const head_cardinals = getCardinalsFromDirection(direction);
    const x = snake.segments[0].location.x + head_cardinals.x;
    const y = snake.segments[0].location.y + head_cardinals.y;
    for (let z = 1; z < snake.segments.length; z++) {
      if (areEqualLocations({ x, y }, snake.segments[z].location)) {
        return true;
      }
    }
    return false;
  }

  private checkFruitCollisions(snake: Snake, fruits: Fruit[]): Fruit {
    const direction = snake.turns.length > 0 && areEqualLocations(snake.turns[0].location, snake.segments[0].location) ?
      snake.turns[0].direction : snake.segments[0].direction;
    const head_cardinals = getCardinalsFromDirection(direction);
    const x = snake.segments[0].location.x + head_cardinals.x;
    const y = snake.segments[0].location.y + head_cardinals.y;
    for (let z = 0; z < fruits.length; z++) {
      if (areEqualLocations({ x, y }, fruits[z].location)) {
        return fruits[z];
      }
    }
    return undefined;
  }

  private getRandomFruitLocation(f: Fruit[], s: Segment[]): Location {
    const fruitLocations = f.map(obj => obj.location);
    const segmentLocations = s.map(obj => obj.location);
    const openSpots = this.getOpenSpots(fruitLocations.concat(segmentLocations));
    const loc = openSpots[getRandomRange(0, openSpots.length - 1)];
    if (loc) {
      return loc;
    } else {
      return { x: -1, y: -1 };
    }
  }

  private getOpenSpots(takenSpots: Location[]): Location[] {
    return this.gameSpots.filter(spot => !(takenSpots.find(ts => (ts.x === spot.x && ts.y === spot.y))));
  }

  initializeGame() {
    setTimeout(() => {
      this.store.dispatch(new InitializeAction(
        {
          width: window.innerWidth + 1,
          height: window.innerHeight + 1
        },
        this.gameSpots[getRandomRange(0, this.gameSpots.length - 1)]
      ));
    });
  }

  createNewFruit() {
    this.store.dispatch(new CreateFruitAction());
  }

  attemptMovement() {
    this.store.dispatch(new AttemptMovementAction());
  }

  setScreenDimensions(dimensions: Dimensions) {
    this.store.dispatch(new ResizeScreenAction(dimensions));
  }

  keyPress(key: string) {
    this.store.dispatch(new KeyPressAction(key));
  }
}
