export class Vector {
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

  get displacementX() {
    return this.coordsX.x2 - this.coordsX.x1
  }

  get displacementY() {
    return this.coordsX.y2 - this.coordsX.y1
  }
}
