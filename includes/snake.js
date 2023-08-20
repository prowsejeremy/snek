class Snake {
  constructor(gridSize, gameOver) {
    this.gameGridSize = gridSize
    this.triggerGameOver = gameOver

    this.pos = {
      x: 10,
      y: 10
    }

    this.velocity = {
      x: 0,
      y: 0
    }

    this.trail = [{ x:this.pos.x, y:this.pos.y }]
    this.tailLength = 5
  }

  reset() {
    this.pos = {
      x: 10,
      y: 10
    }

    this.velocity = {
      x: 0,
      y: 0
    }

    this.trail = [{ x:this.pos.x, y:this.pos.y }]
    this.tailLength = 5
  }

  intersects(pos) {
    return (this.pos.x === pos.x && this.pos.y === pos.y)
  }

  draw(context) {
    this.pos.x += this.velocity.x
    this.pos.y += this.velocity.y
  
    if(this.pos.x < 0) {
      this.pos.x = this.gameGridSize-1
    }
    if (this.pos.x > this.gameGridSize-1) {
      this.pos.x = 0
    }
    if(this.pos.y < 0) {
      this.pos.y = this.gameGridSize-1
    }
    if (this.pos.y > this.gameGridSize-1) {
      this.pos.y = 0
    }
    
    // Snake
    context.fillStyle = '#FFFFFF'

    for (let index = 0; index < this.trail.length; index++) {
      const trailItem = this.trail[index]
      
      context.fillRect(trailItem.x*this.gameGridSize, trailItem.y*this.gameGridSize, this.gameGridSize-2, this.gameGridSize-2)
      
      if ((this.velocity.x !== 0 || this.velocity.y !== 0) && this.pos.x === trailItem.x && this.pos.y === trailItem.y) {
        this.triggerGameOver()
      }
    }

    this.trail.push({ x:this.pos.x, y:this.pos.y })
    while(this.trail.length > this.tailLength) {
      this.trail.shift()
    }
  }
}

export default Snake