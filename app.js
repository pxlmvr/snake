const CANVAS_SIZE = 480
const TILE_SIZE = 20
const FPS = 7
const INTERVAL = 1000 / FPS

let then

let gameover = false

const OPPOSED_DIRECTIONS = {
  U: 'D',
  D: 'U',
  L: 'R',
  R: 'L',
}

const canvas = document.querySelector('#output')
const ctx = canvas.getContext('2d')

canvas.setAttribute('width', CANVAS_SIZE)
canvas.setAttribute('height', CANVAS_SIZE)

let score = 0

const snake = [
  { x: 240, y: 240 },
  { x: 220, y: 240 },
  { x: 200, y: 240 },
]

const fruit = { x: undefined, y: undefined }

let direction = 'R'

const clearCanvas = (ctx) => {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
}

const updateScore = () => {
  document.querySelector('#score').innerHTML = score
  document.querySelector('#length').innerHTML = snake.length
}

const drawSnake = (ctx, snake) => {
  snake.forEach((tile) => {
    ctx.fillStyle = '#FFF'
    ctx.strokeStyle = '#000'

    ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE)
    ctx.strokeRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE)
  })
}

const drawFruit = (fruit) => {
  ctx.fillStyle = '#FFF'
  ctx.strokeStyle = '#000'
  ctx.fillRect(fruit.x, fruit.y, TILE_SIZE, TILE_SIZE)
  ctx.strokeRect(fruit.x, fruit.y, TILE_SIZE, TILE_SIZE)
}

const drawGameOverScreen = (ctx) => {
  ctx.font = '16px monospace'
  ctx.fillStyle = '#FFF'
  ctx.textAlign = 'center'
  ctx.fillText('Game Over', CANVAS_SIZE / 2, CANVAS_SIZE / 2)
}

const moveSnake = (dir, snake, grow = false) => {
  if (!grow) snake.pop()

  let newHead = snake[0]

  switch (dir) {
    case 'U':
      newHead = { x: newHead.x, y: newHead.y - TILE_SIZE }
      break
    case 'D':
      newHead = { x: newHead.x, y: newHead.y + TILE_SIZE }
      break
    case 'R':
      newHead = { x: newHead.x + TILE_SIZE, y: newHead.y }
      break
    case 'L':
      newHead = { x: newHead.x - TILE_SIZE, y: newHead.y }
      break
  }

  snake.unshift(newHead)
}

const spawnFruit = (snake) => {
  let overlapping = true
  while (overlapping) {
    fruit.x = Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE
    fruit.y = Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE
    overlapping = snake.some((tile) => tile.x === fruit.x && tile.y === fruit.y)
  }
}

const checkBorderCollision = (snake) => {
  const head = snake[0]

  if (head.x <= 0 || head.x >= CANVAS_SIZE) {
    gameover = true
    return
  }
  if (head.y <= 0 || head.y >= CANVAS_SIZE) {
    gameover = true
    return
  }

  if (
    snake.some(
      (tile, index) =>
        snake.findIndex(
          (t, i) => i !== index && t.x === tile.x && t.y === tile.y
        ) !== -1
    )
  ) {
    gameover = true
    return
  }
}

const catchesFruit = (snake, fruit) => {
  return snake[0].x === fruit.x && snake[0].y === fruit.y
}

const setDirection = (newDir, current) => {
  if (OPPOSED_DIRECTIONS[newDir] !== current) {
    direction = newDir
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'r') e.preventDefault()
  switch (e.key) {
    case 'ArrowUp':
    case 'Up':
      setDirection('U', direction)
      break
    case 'ArrowDown':
    case 'Down':
      setDirection('D', direction)
      break
    case 'ArrowRight':
    case 'Right':
      setDirection('R', direction)
      break
    case 'ArrowLeft':
    case 'Left':
      setDirection('L', direction)
      break
  }
})

// Initialize first fruit position
spawnFruit(snake)

const tick = (timestamp) => {
  requestAnimationFrame(tick)

  if (then === undefined) {
    then = timestamp
  }

  const delta = timestamp - then

  if (delta > INTERVAL) {
    then = timestamp - (delta % INTERVAL)

    if (gameover) {
      clearCanvas(ctx)
      drawGameOverScreen(ctx)
    } else {
      const catches = catchesFruit(snake, fruit)

      clearCanvas(ctx)

      if (catches) {
        score += 100
        spawnFruit(snake)
      }

      updateScore()
      drawFruit(fruit)
      drawSnake(ctx, snake)
      moveSnake(direction, snake, catches)
      checkBorderCollision(snake)
    }
  }
}

tick(0)
