class Item {
  constructor({canvas, gridSize, elementProps, value}) {
    this.gameCanvas = canvas
    this.gameGridSize = gridSize

    this.element = {
      color: elementProps.color,
      image: new Image()
    }

    if (elementProps.imageObj && !this.element.image.src) {
      this.element.image.src = elementProps.imageObj.src
    }

    this.pos = {
      x: false,
      y: false
    }
    this.value = value || 5
  }

  destroy() {
    this.pos.x = false
    this.pos.y = false
  }

  generateNewItem(snake) {

    const newItem = this.pickNewPosition()
    const passedInspection = this.checkNewItemPosition(snake, newItem)
    
    if (passedInspection) {
      this.pos = newItem
    }
  }

  pickNewPosition() {
    const newItem = {
      x: Math.floor(Math.random() * this.gameGridSize),
      y: Math.floor(Math.random() * this.gameGridSize)
    }
    return newItem
  }
  
  checkNewItemPosition(snake, newItem) {
  
    for (let index = 0; index < snake.trail.length; index++) {
      const trailItem = snake.trail[index]
      if (
        (newItem.x === trailItem.x && newItem.y === trailItem.y) ||
        (newItem.x < 7 && newItem.y > 17)
      ) {
        this.generateNewItem(snake)
        return false
      }
    }
  
    return true
  }

 draw(context, gridSize) {

   if (this.pos.x !== false && this.pos.y !== false) {
     if (this.element.image.src) {
      this.element.image.onload = () => {
        context.drawImage(
          this.element.image,
          this.pos.x*gridSize,
          this.pos.y*gridSize,
          gridSize-2,
          gridSize-2
        )
      }
      context.drawImage(
        this.element.image,
        this.pos.x*gridSize,
        this.pos.y*gridSize,
        gridSize-2,
        gridSize-2
      )
     } else {
        context.fillStyle = this.element.color
        context.fillRect(
          this.pos.x*gridSize,
          this.pos.y*gridSize,
          gridSize-2,
          gridSize-2
        )
     }
   }
 }
}

export default Item