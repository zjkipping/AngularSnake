import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, interval } from 'rxjs';
import { distinctUntilChanged, withLatestFrom, filter, map } from 'rxjs/operators';

import {
  GameState,
  Snake,
  Fruit,
  Dimensions,
  Status,
  TILE_COUNT,
  Location,
  fruitSpawnRate,
  fruitSpawnCap,
  playerMovementRate
} from './types';
import {
  KeyPressAction,
  InitializeAction,
  CreateFruitAction,
  AttemptMovementAction,
  ResizeScreenAction
} from './app.state';

export function getRandomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Injectable({
  providedIn: 'root'
})
export class GameLogicService implements OnDestroy {
  private gameSpots: Location[] = [];
  private lastFruitSpawn =  0;
  private lastPlayerMovement = 0;

  snake: Observable<Snake>;
  fruits: Observable<Fruit[]>;
  screenDimensions: Observable<Dimensions>;
  status: Observable<Status>;
  won: Observable<boolean>;
  tileSize: Observable<number>;
  elapsedTime: number;

  gameLoop: Subscription;

  constructor(private store: Store<GameState>) {
    this.snake = this.store.select(game => game.snake).pipe(distinctUntilChanged());
    this.fruits = this.store.select(game => game.fruits).pipe(distinctUntilChanged());
    this.screenDimensions = this.store.select(game => game.meta.screenDimensions).pipe(distinctUntilChanged());
    this.status = this.store.select(game => game.meta.status).pipe(distinctUntilChanged());
    this.won = this.store.select(game => game.meta.won).pipe(distinctUntilChanged());
    this.tileSize = this.store.select(game => game.meta.tileSize).pipe(distinctUntilChanged());

    for (let x = 0; x < TILE_COUNT; x++) {
      for (let y = 0; y < TILE_COUNT; y++) {
        this.gameSpots.push({ x, y });
      }
    }

    this.gameLoop = interval(1).pipe(
      withLatestFrom(this.store.select(game => game)),
      filter(([num, gameState]) => gameState.meta.status === Status.Running),
      map(([num, gameState]) => this.updateGame(gameState))
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

  initializeGame() {
    this.store.dispatch(new InitializeAction({
        width: window.innerWidth + 1,
        height: window.innerHeight + 1
      },
      this.gameSpots[getRandomRange(0, this.gameSpots.length - 1)]
    ));
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
