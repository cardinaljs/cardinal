export class Rectangle {
  constructor(x1, y1, x2, y2) {
    this.coordsX = {
      x1,
      x2
    }
    this.coordsY = {
      y1,
      y2
    }
  }

  // getter
  get width() {
    return Math.abs(this.displacementX)
  }

  get height() {
    return Math.abs(this.displacementY)
  }

  get greaterWidth() {
    return this.width > this.height
  }

  get greaterHeight() {
    return !this.greaterWidth
  }
}
