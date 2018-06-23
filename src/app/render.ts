import { Situation, Dimensions, Fruit, Segment, Status, Location } from './types';
import { TILE_COUNT } from './utility';

export function render(s: Situation) {
  s.gameCtx.clearRect(0, 0, s.screenDimensions.width, s.screenDimensions.height);
  drawRunningGame(s);
  if (s.status === Status.Paused) {
    drawPausedMenu(s.gameCtx, s.screenDimensions, s.tileSize);
  }
}

function drawRunningGame(s: Situation) {
  drawFruits(s);
  drawSnake(s);
  drawGUI(s);
  if (s.status === Status.Loading) {
    drawLoadingMessage(s.gameCtx, s.screenDimensions, s.tileSize);
  } else if (s.status === Status.Loaded) {
    drawStartUpMessage(s.gameCtx, s.screenDimensions, s.tileSize);
  } else if (s.status === Status.Ended) {
    drawEndGameScreen(s.gameCtx, s.screenDimensions, s.tileSize, s.won);
  }
}

function drawPausedMenu(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number) {
  ctx.save();
  ctx.font = `bold ${calculateFontSize(dimensions.width)}px Arial`;
  const message = 'Game Is Paused (press spacebar to resume)';
  ctx.textAlign = 'center';
  ctx.fillText(message, dimensions.width / 2, (dimensions.height / 2) * 0.8);
  ctx.restore();
}

function drawLoadingMessage(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number) {
  ctx.save();
  ctx.font = `bold ${calculateFontSize(dimensions.width)}px Arial`;
  const message = 'Loading Game Assets';
  ctx.textAlign = 'center';
  ctx.fillText(message, dimensions.width / 2, (dimensions.height / 2) * 0.8);
  ctx.restore();
}

function drawStartUpMessage(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number) {
  ctx.save();
  ctx.font = `bold ${calculateFontSize(dimensions.width)}px Arial`;
  const message = 'Press a direction (wasd) to start the game!';
  ctx.textAlign = 'center';
  ctx.fillText(message, dimensions.width / 2, (dimensions.height / 2) * 0.8);
  ctx.restore();
}

function drawEndGameScreen(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, won: boolean) {
  ctx.save();
  ctx.font = `bold ${calculateFontSize(dimensions.width)}px Arial`;
  let message;
  if (won) {
    message = 'You Won! Congratulations';
  } else {
    message = 'You Lost... hit space to try again';
  }
  ctx.textAlign = 'center';
  ctx.fillText(message, dimensions.width / 2, (dimensions.height / 2) * 0.9);
  ctx.restore();
}

function drawFruits(s: Situation) {
  for (let x = 0; x < s.fruits.length; x++) {
    drawFruit(s.gameCtx, s.screenDimensions, s.tileSize, s.fruits[x]);
  }
}

function drawFruit(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, fruit: Fruit) {
  ctx.save();
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(fruit.location.x * tileSize, fruit.location.y * tileSize, tileSize, tileSize);
  ctx.restore();
}

function drawSnake(s: Situation) {
  for (let x = 1; x < s.snake.segments.length; x++) {
    drawBodySegment(s.gameCtx, s.screenDimensions, s.tileSize, s.snake.segments[x], x === 0 ? '#008000' : '#006000');
  }
  drawBodySegment(s.gameCtx, s.screenDimensions, s.tileSize, s.snake.segments[0], 0 === 0 ? '#008000' : '#006000');
}

function drawBodySegment(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, segment: Segment, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(segment.location.x * tileSize, segment.location.y * tileSize, tileSize, tileSize);
  ctx.restore();
}

function drawGUI(s: Situation) {
  drawElapsedTime(s.gameCtx, s.screenDimensions, s.tileSize, s.elapsedTime);
}

function drawElapsedTime(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, elapsedTime: number = 0) {
  ctx.save();
  const seconds = elapsedTime / 1000;
  ctx.font = `bold ${calculateFontSize(dimensions.width * 0.7)}px Arial`;
  const message = `Play Time: ${seconds}`;
  ctx.textAlign = 'left';
  ctx.fillText(message, dimensions.width * 0.01, dimensions.height * 0.03);
  ctx.restore();
}

function calculateFontSize(width: number) {
  return width * 0.04;
}
