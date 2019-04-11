import {Vector} from './vector'

export class Rectangle extends Vector {
  constructor(x1, y1, x2, y2) {
    super(x1, y1, x2, y2)
  }

  // getter
  get width() {
    return Math.abs(this.displacementX)
  }

  get height() {
    return Math.abs(this.displacementY)
  }

  // methods
  get greaterWidth() {
    return this.width > this.height
  }

  get greaterHeight() {
    return !this.greaterWidth
  }
}
