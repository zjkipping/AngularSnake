import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input, HostListener } from '@angular/core';

import { Snake, Fruit, Dimensions, Status } from '../types';
import { render } from '../render';
import { GameLogicService } from '../game-logic.service';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit {
  @Output() keyPress: EventEmitter<string> = new EventEmitter<string>();
  @Output() canvasLoaded = new EventEmitter();
  @ViewChild('gameCanvas') gameCanvasRef: ElementRef;
  private gameCanvas: HTMLCanvasElement;
  private drawPending = false;
  private _snake: Snake;
  private _fruits: Fruit[] = [];
  private _elapsedTime: number;
  private _screenDimensions: Dimensions;
  private _status: Status;
  private _tileSize: number;
  private _won: boolean;
  gameCtx: CanvasRenderingContext2D;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.gls.setScreenDimensions({ width: event.target.innerWidth + 1, height: event.target.innerHeight + 1 });
  }

  @Input() set snake(value: Snake) {
    this._snake = value;
    this.draw();
  }
  get snake() {
    return this._snake;
  }

  @Input() set fruits(value: Fruit[]) {
    this._fruits = value;
    this.draw();
  }
  get fruits() {
    return this._fruits;
  }

  @Input() set elapsedTime(value: number) {
    this._elapsedTime = value;
    this.draw();
  }
  get elapsedTime() {
    return this._elapsedTime;
  }

  @Input() set screenDimensions(value: Dimensions) {
    this._screenDimensions = value;
    this.resizeCanvas(value);
  }
  get screenDimensions() {
    return this._screenDimensions;
  }

  @Input() set status(value: Status) {
    this._status = value;
    this.draw();
  }
  get status() {
    return this._status;
  }

  @Input() set won(value: boolean) {
    this._won = value;
    this.draw();
  }
  get won() {
    return this._won;
  }

  @Input() set tileSize(value: number) {
    this._tileSize = value;
    this.draw();
  }
  get tileSize() {
    return this._tileSize;
  }

  constructor(private gls: GameLogicService) { }

  ngOnInit() {
    this.gameCanvas = this.gameCanvasRef.nativeElement;
    this.gameCtx = this.gameCanvas.getContext('2d');
    this.gameCanvas.focus();
    this.canvasLoaded.emit();
  }

  private draw() {
    if (!this.drawPending) {
      requestAnimationFrame(this.renderFrame.bind(this));
    }
  }

  private renderFrame() {
    this.drawPending = true;
    if (this.gameCtx && this.fruits !== undefined && this.snake) {
      render(this);
    }
    this.drawPending = false;
  }

  private resizeCanvas(dimensions: Dimensions) {
    if (this.gameCanvas) {
      this.gameCanvas.width = dimensions.width;
      this.gameCanvas.height = dimensions.height;
      this.draw();
    }
  }

  keyWasPressed(event: KeyboardEvent) {
    this.keyPress.emit(event.key);
  }
}
