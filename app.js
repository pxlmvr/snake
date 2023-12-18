const CANVAS_SIZE = 480
const TILE_SIZE = 20
const FPS = 5
const INTERVAL = 1000 / FPS

let then

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

let direction = 'R'

const clearCanvas = (ctx) => {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
}

const updateScore = () => {
  document.querySelector('#score').innerHTML = score
}

const drawSnake = (ctx, snake) => {
  snake.forEach((tile) => {
    ctx.fillStyle = '#FFF'
    ctx.strokeStyle = '#000'

    ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE)
    ctx.strokeRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE)
  })
}

const moveSnake = (dir, snake) => {
  snake.pop()

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

const setDirection = (newDir, current) => {
  if (OPPOSED_DIRECTIONS[newDir] !== current) {
    direction = newDir
  }
}

document.addEventListener('keydown', (e) => {
  e.preventDefault()
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

const tick = (timestamp) => {
  requestAnimationFrame(tick)

  if (then === undefined) {
    then = timestamp
  }

  const delta = timestamp - then

  if (delta > INTERVAL) {
    then = timestamp - (delta % INTERVAL)

    clearCanvas(ctx)
    updateScore()
    drawSnake(ctx, snake)
    moveSnake(direction, snake)
  }
}

tick(0)
