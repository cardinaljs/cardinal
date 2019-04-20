import { Vector } from './vector'

export class Rectangle extends Vector {
  constructor(x1, y1, x2, y2) {
    super(x1, y1, x2, y2)
    this._isVector = false
  }

  // getter
  get width() {
    if(!this._isVector) {
      return Math.abs(this.displacementX)
    }
    return undefined
  }

  get height() {
    if (!this._isVector) {
      return Math.abs(this.displacementY)
    }
    return undefined
  }

  get greaterWidth() {
    return this.width > this.height
  }

  get greaterHeight() {
    return !this.greaterWidth
  }

  get displacementX() {
    if (this._isVector) {
      return super.displacementX
    }
    return undefined
  }

  get displacementY() {
    if (this._isVector) {
      return super.displacementY
    }
    return undefined
  }

  toVector() {
    this._isVector = true
    return this
  }

  toScalar() {
    if (!this._isVector) {
      return undefined
    }
    this._isVector = false
    return this
  }
}
