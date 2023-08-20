class Button {

  constructor(text, font, fillColor, textColor) {
    this.text = text
    this.fillColor = fillColor
    this.textColor = textColor
    this.font = font || '18px Arial'
  }

  setPosition(x, y) {
    this.x = x
    this.y = y
  }

  setSize(width, height) {
    this.width = width
    this.height = height
  }

  getScaledValue(percentage, value) {
    return (percentage * value) + value
  }

  inBounds(scaledPercentage, mouseX, mouseY) {

    const scaledValues = {
      x: this.getScaledValue(scaledPercentage, this.x),
      y: this.getScaledValue(scaledPercentage, this.y),
      w: this.getScaledValue(scaledPercentage, this.width),
      h: this.getScaledValue(scaledPercentage, this.height)
    }

    return !(
      mouseX < scaledValues.x ||
      mouseX > scaledValues.x + scaledValues.w ||
      mouseY < scaledValues.y ||
      mouseY > scaledValues.y + scaledValues.h
    )
  }

  draw(context) {
    // draw the button body
    context.fillStyle = this.fillColor
    context.fillRect(this.x, this.y, this.width, this.height)
    // draw the button text
    context.fillStyle = this.textColor
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = this.font
    context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 1.8, this.width)
  }
}

export default Button