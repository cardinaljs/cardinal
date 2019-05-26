import {
  Rectangle
} from './rectangle'

export class VectorRectangle extends Rectangle {
  // eslint-disable-next-line no-useless-constructor
  constructor(x1, y1, x2, y2) {
    super(x1, y1, x2, y2)
  }

  get displacementX() {
    return this.coordsX.x2 - this.coordsX.x1
  }

  get displacementY() {
    return this.coordsY.y2 - this.coordsY.y1
  }

  get diagonalLength() {
    if (!this.displacementY) {
      return this.displacementX
    } else if (!this.displacementX) {
      return this.displacementY
    }
    return Math.sqrt(
      this.displacementY ** 2 + this.displacementX ** 2
    )
  }
}
