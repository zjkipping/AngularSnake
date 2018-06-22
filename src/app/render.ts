import { Situation, Dimensions, Fruit, Segment, Status, SegmentType } from './types';

export function getRandomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  ctx.font = `bold ${calculateFontSize(tileSize)}px Arial`;
  const message = 'Game Is Paused (press spacebar to resume)';
  ctx.textAlign = 'center';
  ctx.fillText(message, dimensions.width / 2, (dimensions.height / 2) * 0.8);
  ctx.restore();
}

function drawLoadingMessage(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number) {
  ctx.save();
  ctx.font = `bold ${calculateFontSize(tileSize)}px Arial`;
  const message = 'Loading Game Assets';
  ctx.textAlign = 'center';
  ctx.fillText(message, dimensions.width / 2, (dimensions.height / 2) * 0.8);
  ctx.restore();
}

function drawStartUpMessage(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number) {
  ctx.save();
  ctx.font = `bold ${calculateFontSize(tileSize)}px Arial`;
  const message = 'Press a direction (wasd) to start the game!';
  ctx.textAlign = 'center';
  ctx.fillText(message, dimensions.width / 2, (dimensions.height / 2) * 0.8);
  ctx.restore();
}

function drawEndGameScreen(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, won: boolean) {
  ctx.save();
  ctx.font = `bold ${calculateFontSize(tileSize)}px Arial`;
  let message;
  if (won) {
    message = 'You Won! Congratulations';
  } else {
    message = 'You Lost... Try again next time';
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
  drawHead(s.gameCtx, s.screenDimensions, s.tileSize, s.snake.head);
  for (let x = 0; x < s.snake.segments.length; x++) {
    if (s.snake.segments[x].type !== SegmentType.TURN) {
      drawBodySegment(s.gameCtx, s.screenDimensions, s.tileSize, s.snake.segments[x]);
    } else {
      drawBodyTurn(s.gameCtx, s.screenDimensions, s.tileSize, s.snake.segments[x]);
    }
  }
}

function drawHead(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, head: Segment) {
  ctx.save();
  ctx.fillStyle = '#008000';
  ctx.fillRect(head.location.x * tileSize, head.location.y * tileSize, tileSize, tileSize);
  ctx.restore();
}

function drawBodySegment(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, segment: Segment) {
  ctx.save();
  ctx.fillStyle = '#007000';
  ctx.fillRect(segment.location.x * tileSize, segment.location.y * tileSize, tileSize, tileSize);
  ctx.restore();
}

function drawBodyTurn(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, segment: Segment) {
  ctx.save();
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(segment.location.x * tileSize, segment.location.y * tileSize, tileSize, tileSize);
  ctx.restore();
}

function drawGUI(s: Situation) {
  drawElapsedTime(s.gameCtx, s.screenDimensions, s.tileSize, s.elapsedTime);
}

function drawElapsedTime(ctx: CanvasRenderingContext2D, dimensions: Dimensions, tileSize: number, elapsedTime: number = 0) {
  ctx.save();
  const seconds = elapsedTime / 1000;
  ctx.font = `bold ${calculateFontSize(tileSize * 0.7)}px Arial`;
  const message = `Play Time: ${seconds}`;
  ctx.textAlign = 'left';
  ctx.fillText(message, dimensions.width * 0.01, dimensions.height * 0.025);
  ctx.restore();
}

function calculateFontSize(tileSize: number) {
  return tileSize * 1.1;
}
