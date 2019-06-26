import {
  Circle,
  RAD
} from './circle'
import {
  Path
} from '../util'

const ZERO = 0
const DEG = 1 / RAD
/**
 * Enum of all quadrants from first to fourth.
 * The quadrant is not a usual one; it starts from the 12th
 * hand of the clock and moves anti-clockwise
 * @enum {number}
 * @const
 */
const Quadrant = {
  FIRST: 360,
  SECOND: 90,
  THIRD: 180,
  FOURTH: 270
}

export default class CircularPath extends Circle {
  constructor(radius, ...angles) {
    super(radius)
    this._angles = angles
    this.angles = angles.map((value) => this._degToRad(value))
    this._quad = null
  }

  get paths() {
    /**
     * @type {Path[]}
     */
    const out = []
    this.angles.forEach((value) => {
      const [
        x, y
      ] = this._findPath(value)
      out.push(new Path(x, y))
    })
    return out
  }

  // private
  _degToRad(deg) {
    return RAD * deg
  }

  _radToDeg(rad) {
    return DEG * rad
  }

  _findPath(angle) {
    const DEG_ANGLE = this._radToDeg(angle)
    if (DEG_ANGLE === Quadrant.FIRST || DEG_ANGLE === ZERO) {
      return [this.radius, ZERO]
    } else if (DEG_ANGLE === Quadrant.SECOND) {
      return [ZERO, this.radius]
    } else if (DEG_ANGLE === Quadrant.THIRD) {
      return [-this.radius, ZERO]
    } else if (DEG_ANGLE === Quadrant.FOURTH) {
      return [ZERO, -this.radius]
    }
    // const quad = this.getQuadrant(DEG_ANGLE)
    return [
      this.radius * Math.cos(angle), this.radius * Math.sin(angle)
    ]
  }

  getQuadrant(angle) {
    if (angle <= Quadrant.FIRST) {
      return Quadrant.FIRST
    } else if (angle <= Quadrant.SECOND && angle > Quadrant.FIRST) {
      return Quadrant.SECOND
    } else if (angle <= Quadrant.THIRD && angle > Quadrant.SECOND) {
      return Quadrant.THIRD
    } else if (angle <= Quadrant.FOURTH && angle > Quadrant.THIRD) {
      return Quadrant.FOURTH
    }
    throw RangeError('Quadrant out of range')
  }
}
