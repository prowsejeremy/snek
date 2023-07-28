class Button {

  constructor(text, font, fillColor, textColor) {
    this.text = text
    this.fillColor = fillColor
    this.textColor = textColor
    this.font = font || '18px Arial'
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  inBounds(mouseX, mouseY) {
    return !(mouseX < this.x || mouseX > this.x + this.width || mouseY < this.y || mouseY > this.y + this.height);
  }

  draw(context) {
    // draw the button body
    context.fillStyle = this.fillColor;
    context.fillRect(this.x, this.y, this.width, this.height);
    // draw the button text
    context.fillStyle = this.textColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = this.font;
    context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2, this.width);
  }
}

module.exports = Button