import { Vector } from './vector'

export class Rectangle extends Vector {
  constructor(x1, y1, x2, y2) {
    super(x1, y1, x2, y2)
    //this.inheritted = true
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
