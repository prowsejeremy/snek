const Button = require('./button.js')

class Snek {

  constructor({gameFont, gameElement}) {

    if (!gameElement) throw console.error("Uh Oh, please provide a gameElement (html element) to render to.");

    // Game Variables
    this.runTime = false
    this.changeInitiated = false
    
    // Play area
    this.gridSize = 20
    this.tileCount = 20
    this.canvas = document.createElement('canvas')
    this.canvas.width = 400
    this.canvas.height = 400
    this.canvas.tabIndex = 1
    this.gameElement = gameElement
    
    this.appleImage = {
      object: require('../images/apple.svg').default,
      image: false
    }
    this.poisonImage = {
      object: require('../images/poison.svg').default,
      image: false
    }
    this.bonusImage = {
      object: require('../images/star.svg').default,
      image: false
    }

    // Controls
    this.touchStartPos = {x:0,y:0}
    this.touchEndPos = {x:0,y:0}

    // Messages
    this.font = gameFont || 'Arial'
    this.fontColor = '#FFFFFF'
    this.margin = 15

    this.scoreText = 'SCORE'
    this.scoreFontSize = 25
    this.scoreFont = `600 ${this.scoreFontSize}px ${this.font}`
    
    this.gameOverBackgroundColor = '#FFFFFF'
    this.gameOverFontColor = '#000000'
    this.gameOverText = 'GAME OVER'
    this.gameOverFontSize = 50;
    this.gameOverFont = `600 ${this.gameOverFontSize}px ${this.font}`;
    this.playAgainButton = new Button('PLAY AGAIN', this.scoreFont, 'red', 'black')
    this.playAgainButton.onClick = () => this.reset()
  }

  init() {
    this.gameElement.appendChild(this.canvas)
    this.context = this.canvas.getContext('2d')

    this.canvas.addEventListener('keydown', (e) => {this.handleKeyPress(e)})
    this.canvas.addEventListener('touchstart', (e) => {this.handleTouchStart(e)})
    this.canvas.addEventListener('touchend', (e) => {this.handleTouchEnd(e)})
    
    this.canvas.addEventListener('click', (event) => {
      const canvasRect = this.canvas.getBoundingClientRect();
      let x = event.clientX - canvasRect.left;
      let y = event.clientY - canvasRect.top;

      if (!this.gameEnabled && this.playAgainButton.inBounds(x, y) && !!this.playAgainButton.onClick) this.playAgainButton.onClick()
    })

    // Load image assets

    if (!this.appleImage.image) {
      this.appleImage.image = new Image()
      this.appleImage.image.src = this.appleImage.object.src
    }
    if (!this.poisonImage.image) {
      this.poisonImage.image = new Image()
      this.poisonImage.image.src = this.poisonImage.object.src
    }
    if (!this.bonusImage.image) {
      this.bonusImage.image = new Image()
      this.bonusImage.image.src = this.bonusImage.object.src
    }

    this.reset()
  }

  destroy() {
    clearInterval(this.runTime);
    this.gameElement.removeChild(this.canvas);
  }

  updateScore(value = 5) {
    this.score+=value
  }
  
  gameOver() {
    this.gameStart = false
    this.gameEnabled = false
    clearInterval(this.runTime)
    
    setTimeout(() => {
      this.printGameOver()
    }, 300)
  }
  
  reset() {
    this.gameStart = false
    this.gameEnabled = true
    this.score = 0
    // Snake
    this.snakeX = 10
    this.snakeY = 10
    this.velocityX = 
    this.velocityY = 0
    this.trail = []
    this.tailLength = 5

    // Collectables
    this.appleX = Math.floor(Math.random() * this.tileCount)
    this.appleY = Math.floor(Math.random() * this.tileCount)
    this.poisonX = false
    this.poisonY = false
    this.bonusX = false
    this.bonusY = false

    this.runTime = setInterval(() => {this.game()}, 1000/10)
  }
  
  game() {
  
    // Fill game canvas
    this.context.fillStyle = '#161414'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.printScore()
  
    this.snakeX += this.velocityX
    this.snakeY += this.velocityY
  
    this.canvas.style = 'outline: none;'
  
    if(this.snakeX < 0) {
      this.snakeX = this.tileCount-1
    }
    if (this.snakeX > this.tileCount-1) {
      this.snakeX = 0
    }
    if(this.snakeY < 0) {
      this.snakeY = this.tileCount-1
    }
    if (this.snakeY > this.tileCount-1) {
      this.snakeY = 0
    }
    
    // Snake
    this.context.fillStyle = '#FFFFFF'
    for (let index = 0; index < this.trail.length; index++) {
      const trailItem = this.trail[index]
      
      this.context.fillRect(trailItem.x*this.gridSize, trailItem.y*this.gridSize, this.gridSize-2, this.gridSize-2)
      
      if (this.gameStart && this.snakeX === trailItem.x && this.snakeY === trailItem.y) {
        this.gameOver()
      }
    }
    
    this.trail.push({ x:this.snakeX, y:this.snakeY })
    while(this.trail.length > this.tailLength) {
      this.trail.shift()
    }
    
    // Apple
    if (this.snakeX === this.appleX && this.snakeY === this.appleY) {
      this.appleX = false
      this.appleY = false
      
      this.tailLength++
      this.updateScore(5)
      this.generateNewItem('apple')
      this.tailLength % 4 === 0 && this.poisonX === false && this.poisonY === false && this.generateNewItem('poison')
      this.tailLength % 7 === 0 && this.poisonX === false && this.poisonY === false && this.bonusX === false && this.bonusY === false && this.generateNewItem('bonus')
    }
  
    // Poison
    if (this.snakeX === this.poisonX && this.snakeY === this.poisonY) {
      this.poisonX = false
      this.poisonY = false
      this.updateScore(-3)
    }
  
    // Bonus
    if (this.snakeX === this.bonusX && this.snakeY === this.bonusY) {
      this.bonusX = false
      this.bonusY = false
      this.updateScore(10)
    }
  
    if (this.appleX !== false && this.appleY !== false) {
      if (this.appleImage.image) {
        this.context.drawImage(this.appleImage.image, this.appleX*this.gridSize, this.appleY*this.gridSize, this.gridSize-2, this.gridSize-2)
      } else {
        this.context.fillStyle = '#00FF00'
        this.context.fillRect(this.appleX*this.gridSize, this.appleY*this.gridSize, this.gridSize-2, this.gridSize-2)
      }
    }
  
    if (this.poisonX !== false && this.poisonY !== false) {
      setTimeout(() => {
        this.poisonX = false
        this.poisonY = false
      }, 5000)

      if (this.poisonImage.image) {
        this.context.drawImage(this.poisonImage.image, this.poisonX*this.gridSize, this.poisonY*this.gridSize, this.gridSize-2, this.gridSize-2)
      } else {
        this.context.fillStyle = '#FF0000'
        this.context.fillRect(this.poisonX*this.gridSize, this.poisonY*this.gridSize, this.gridSize-2, this.gridSize-2)
      }
    }
  
    if (this.bonusX !== false && this.bonusY !== false) {
      setTimeout(() => {
        this.bonusX = false
        this.bonusY = false
      }, 5000)

      if (this.bonusImage.image) {
        this.context.drawImage(this.bonusImage.image, this.bonusX*this.gridSize, this.bonusY*this.gridSize, this.gridSize-2, this.gridSize-2)
      } else {
        this.context.fillStyle = '#FFFF00'
        this.context.fillRect(this.bonusX*this.gridSize, this.bonusY*this.gridSize, this.gridSize-2, this.gridSize-2)
      }
    }
  }
  
  async generateNewItem(kind) {
  
    const newItem = await this.pickNewItem()
    const passedInspection = await this.checkNewItem(newItem, kind)
    
    if (passedInspection) {
      switch(kind) {
        case 'apple':
          this.appleX = newItem.x
          this.appleY = newItem.y
        break
        case 'poison':
          this.poisonX = newItem.x
          this.poisonY = newItem.y
        break
        case 'bonus':
          this.bonusX = newItem.x
          this.bonusY = newItem.y
        break
      }
    }
  }
  
  pickNewItem() {
    const newItem = {
      x: Math.floor(Math.random() * this.tileCount),
      y: Math.floor(Math.random() * this.tileCount)
    }
    return newItem
  }
  
  checkNewItem(newItem, kind) {
  
    for (let index = 0; index < this.trail.length; index++) {
      const trailItem = this.trail[index]
      if ( newItem.x === trailItem.x && newItem.y === trailItem.y ) {
        this.generateNewItem(kind)
        return false
      }
    }
  
    return true
  }
  
  // Handle controls
  
  handleDirChange(dir) {
    if (!this.gameEnabled || this.changeInitiated) return false
  
    setTimeout(() => { this.changeInitiated = false }, 60)
  
    switch (dir) {
      case 'left':
        this.gameStart = true
        if (this.velocityX === 0) {
          this.velocityX = -1
          this.velocityY = 0
        }
        break
      case 'up':
        this.gameStart = true
        if (this.velocityY === 0) {
          this.velocityX = 0
          this.velocityY = -1
        }
        break
      case 'right':
        this.gameStart = true
        if (this.velocityX === 0) {
          this.velocityX = 1
          this.velocityY = 0
        }
        break
      case 'down':
        this.gameStart = true
        if (this.velocityY === 0) {
          this.velocityX = 0
          this.velocityY = 1
        }
        break
    }
  
    this.changeInitiated = true
  
  }

  // //////////////////////////
  // MESSAGE FUNCTIONS
  // //////////////////////////

  print(text, x, y) {
    this.context.fillText(text, x, y);
  }

  printCenteredText(text, font, yOffset = 0) {
    this.context.font = font;
    this.context.textAlign = 'center';
    
    this.print(text, this.canvas.width / 2, this.canvas.height / 2 - yOffset);
  }

  printScore() {
    this.context.fillStyle = this.fontColor;
    this.context.font = this.scoreFont;
    this.context.textAlign = 'left';
    
    this.print(`${this.scoreText} ${this.score}`, this.margin, this.canvas.height - this.margin)
  }

  printGameOver() {
    // Draw Rect
    this.context.fillStyle = this.gameOverBackgroundColor
    this.context.fillRect(this.margin, this.margin, this.canvas.width - (this.margin * 2), this.canvas.height - (this.margin * 2))

    // Draw 'Game Over'
    this.context.fillStyle = this.gameOverFontColor
    this.printCenteredText(this.gameOverText, this.gameOverFont, 30);

    // Draw 'Score:'
    this.context.fillStyle = this.gameOverFontColor
    this.printCenteredText(`${this.scoreText} ${this.score}`, this.scoreFont);
    
    this.playAgainButton.setSize(180, 80)
    this.playAgainButton.setPosition((this.canvas.width / 2) - 90, (this.canvas.height / 2) + 20)
    this.playAgainButton.draw(this.context)
    // this.printCenteredText(this.GAME_OVER_PRESS_SPACE_TEXT, this.GAME_OVER_FONT, -this.GAME_OVER_MARGIN_BETWEEN_LINES);
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

module.exports = Snek