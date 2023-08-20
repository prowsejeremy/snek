import Item from './item.js'
import Snake from './snake.js'
import Button from './button.js'
import EventEmitter from './eventemitter.js'

class Snek {

  constructor({gameElement, gameFont}) {

    if (!gameElement) throw console.error('Uh Oh, please provide a gameElement (html element) to render to.')

    // Game Variables
    this.runTime = false
    this.changeInitiated = false
    this.framerate = 1000/10
    this.bufferedInput = false
    
    // Play area
    this.gridSize = 20
    this.canvas = document.createElement('canvas')
    this.canvas.width = 400
    this.canvas.height = 400
    this.canvas.tabIndex = 1
    this.gameElement = gameElement

    // Controls
    this.touchStartPos = {x:0,y:0}
    this.touchEndPos = {x:0,y:0}

    // Messages
    this.font = gameFont?.family || 'Impact'
    this.fontSize = gameFont?.size || 25
    this.fontWeight = gameFont?.weight || 'normal'
    this.fontColor = gameFont?.color || '#FFFFFF'
    this.margin = 15

    this.scoreText = 'SCORE'
    this.scoreFontSize = this.fontSize * 0.9
    this.scoreFont = `${this.fontWeight} ${this.scoreFontSize}px ${this.font}`

    this.gameOverBackgroundColor = '#150303'
    this.gameOverFontColor = this.fontColor
    this.gameOverText = 'GAME OVER'
    this.gameOverFontSize = this.fontSize * 2
    this.gameOverFont = `${this.fontWeight} ${this.gameOverFontSize}px ${this.font}`
    this.playAgainButton = new Button('PLAY AGAIN', this.scoreFont, '#D21A1A', '#000000')
    this.playAgainButton.onClick = () => this.reset()

    // Items
    this.apple = new Item({
      canvas: this.canvas,
      gridSize: this.gridSize,
      value: 5,
      elementProps: {
        imageObj: require('../images/apple.svg').default,
        color: '#00FF00'
      }
    })
    this.poison = new Item({
      canvas: this.canvas,
      gridSize: this.gridSize,
      value: -3,
      elementProps: {
        imageObj: require('../images/poison.svg').default,
        color: '#FF0000'
      }
    })
    this.bonus = new Item({
      canvas: this.canvas,
      gridSize: this.gridSize,
      value: 10,
      elementProps:{
        imageObj: require('../images/bonus.svg').default,
        color: '#FFFF00'
      }
    })

    // Snake
    this.snake = new Snake(this.gridSize, () => {this.gameOver()})

    // custom event emitter
    this._e = new EventEmitter()
  }

  init() {

    this.gameElement.appendChild(this.canvas)
    this.context = this.canvas.getContext('2d')

    this.canvas.addEventListener('keydown', (e) => {this.handleKeyPress(e)})
    this.canvas.addEventListener('touchstart', (e) => {this.handleTouchStart(e)})
    this.canvas.addEventListener('touchend', (e) => {this.handleTouchEnd(e)})
    
    this.canvas.addEventListener('pointerdown', (event) => {
      const canvasRect = this.canvas.getBoundingClientRect()
      const realCanvasWidth = canvasRect.width
      const x = event.clientX - canvasRect.left
      const y = event.clientY - canvasRect.top
      
      const scaledPercentage = (realCanvasWidth - this.canvas.width) / this.canvas.width

      if (!this.gameEnabled && this.playAgainButton.inBounds(scaledPercentage, x, y) && !!this.playAgainButton.onClick) this.playAgainButton.onClick()
    })

    this.reset()
  }

  on(event, handler) {
    this._e.on(event, handler)

    return this
  }

  destroy() {
    clearInterval(this.runTime)
    this.gameElement.removeChild(this.canvas)
  }

  updateScore(value = 5) {
    this.score+=value
  }

  startGame() {
    this._e.emit('start')
    this.gameStart = true
    this.runTime = setInterval(() => {this.draw()}, this.framerate)
  }
  
  gameOver() {
    this._e.emit('end', this.score)

    this.gameStart = false
    this.gameEnabled = false
    clearInterval(this.runTime)
    
    setTimeout(() => {
      this.printGameOver()
    }, 300)
  }
  
  reset() {
    this._e.emit('reset')

    this.gameStart = false
    this.gameEnabled = true
    this.score = 0

    this.snake.reset()

    // Collectables
    this.apple.generateNewItem(this.snake)
    this.poison.destroy()
    this.bonus.destroy()

    // Generate First Frame
    this.draw()
  }

  draw() {
    // Fill game canvas
    this.canvas.style = 'outline: none'

    this.context.fillStyle = '#161414'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.printScore()

    this.snake.draw(this.context)
    this.apple.draw(this.context, this.gridSize)
    this.poison.draw(this.context, this.gridSize)
    this.bonus.draw(this.context, this.gridSize)

    if (this.snake.intersects(this.apple.pos)) {
      this.apple.destroy()
      
      this.snake.tailLength++
      this.updateScore(this.apple.value)
      this.apple.generateNewItem(this.snake)

      if (this.snake.tailLength % 4 === 0 && this.poison.pos.x === false) {
        this.poison.generateNewItem(this.snake)
        setTimeout(() => {
          this.poison.destroy()
        }, 5000)
      }

      if (this.snake.tailLength % 7 === 0 && this.bonus.pos.x === false) {
        this.bonus.generateNewItem(this.snake)
        setTimeout(() => {
          this.bonus.destroy()
        }, 5000)
      }
    }

    if (this.snake.intersects(this.poison.pos)) {
      this.poison.destroy()
      this.updateScore(this.poison.value)
    }

    if (this.snake.intersects(this.bonus.pos)) {
      this.bonus.destroy()
      this.updateScore(this.bonus.value)
    }

  }

  // //////////////////////////
  // Handle Direction Change
  // //////////////////////////

  handleDirChange(dir) {
    if (!this.gameEnabled || this.changeInitiated) {
      this.bufferedInput = dir
      return false
    }

    if (!this.gameStart) {
      this.startGame()
    }
    
    setTimeout(() => {
      this.changeInitiated = false
      if (this.bufferedInput !== false) {
        this.handleDirChange(this.bufferedInput)
        this.bufferedInput = false
      }
    }, this.framerate)
  
    switch (dir) {
      case 'left':
        if (this.snake.velocity.x === 0) {
          this.snake.velocity.x = -1
          this.snake.velocity.y = 0
        }
        break
      case 'up':
        if (this.snake.velocity.y === 0) {
          this.snake.velocity.x = 0
          this.snake.velocity.y = -1
        }
        break
      case 'right':
        if (this.snake.velocity.x === 0) {
          this.snake.velocity.x = 1
          this.snake.velocity.y = 0
        }
        break
      case 'down':
        if (this.snake.velocity.y === 0) {
          this.snake.velocity.x = 0
          this.snake.velocity.y = 1
        }
        break
    }
  
    this.changeInitiated = true
  
  }

  // //////////////////////////
  // MESSAGE FUNCTIONS
  // //////////////////////////

  print(text, x, y) {
    this.context.fillText(text, x, y)
  }

  printCenteredText(text, font, yOffset = 0) {
    this.context.font = font
    this.context.textAlign = 'center'
    
    this.print(text, this.canvas.width / 2, this.canvas.height / 2 - yOffset)
  }

  printScore() {
    this.context.fillStyle = this.fontColor
    this.context.font = this.scoreFont
    this.context.textAlign = 'left'
    
    this.print(`${this.scoreText} ${this.score}`, this.margin, this.canvas.height - this.margin)
  }

  printGameOver() {
    // Draw Rect
    this.context.fillStyle = this.gameOverBackgroundColor
    this.context.fillRect(this.margin, this.margin, this.canvas.width - (this.margin * 2), this.canvas.height - (this.margin * 2))

    // Draw 'Game Over'
    this.context.fillStyle = this.gameOverFontColor
    this.printCenteredText(this.gameOverText, this.gameOverFont, 30)

    // Draw 'Score:'
    this.context.fillStyle = this.gameOverFontColor
    this.printCenteredText(`${this.scoreText} ${this.score}`, this.scoreFont)
    
    this.playAgainButton.setSize(160, 60)
    this.playAgainButton.setPosition((this.canvas.width / 2) - 80, (this.canvas.height / 2) + 20)
    this.playAgainButton.draw(this.context)
  }
  

  // //////////////////////////
  // HANDLE INPUTS
  // //////////////////////////

  handleKeyPress(e) {
    switch(e.keyCode) {
      case 37:
        this.handleDirChange('left')
        break
      case 38:
        this.handleDirChange('up')
        break
      case 39:
        this.handleDirChange('right')
        break
      case 40:
        this.handleDirChange('down')
        break
    }
  }
  
  handleTouchStart(touch) {
    touch.preventDefault()
    this.touchStartPos.x = touch.changedTouches[0].clientX
    this.touchStartPos.y = touch.changedTouches[0].clientY
  }
  
  handleTouchEnd(touch) {
    touch.preventDefault()
    this.touchEndPos.x = touch.changedTouches[0].clientX
    this.touchEndPos.y = touch.changedTouches[0].clientY
  
    const changedX = this.touchStartPos.x > this.touchEndPos.x ? this.touchStartPos.x - this.touchEndPos.x : this.touchEndPos.x - this.touchStartPos.x
    const changedY = this.touchStartPos.y > this.touchEndPos.y ? this.touchStartPos.y - this.touchEndPos.y : this.touchEndPos.y - this.touchStartPos.y
  
    if (changedX > changedY) {
  
      if (this.touchStartPos.x - this.touchEndPos.x > 0) {
        this.handleDirChange('left')
      } else {
        this.handleDirChange('right')
      }
    } else {
  
      if (this.touchStartPos.y - this.touchEndPos.y > 0) {
        this.handleDirChange('up')
      } else {
        this.handleDirChange('down')
      }
    }
  }
}

export default Snek