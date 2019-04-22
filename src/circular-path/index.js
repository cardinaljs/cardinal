import {
  Circle,
  HALF,
  POINT_ANGLE,
  RAD
} from './circle'

const ZERO = 0
const DEG = 1 / RAD
const RIGHT_ANGLE = POINT_ANGLE * HALF ** 2
/**
 * Enum of all quadrants from first to fourth.
 * The quadrant is not a usual one; it starts from the 12th
 * hand of the clock and moves anti-clockwise
 * @enum {number}
 * @const
 */
const Quadrant = {
  FIRST: 90,
  SECOND: 180,
  THIRD: 270,
  FOURTH: 360
}

// There are two Triangles formed 1) Right angle 2) issoceles
export default class CircularPath extends Circle {
  constructor(radius, angles) {
    super(radius)
    this._angles = angles
    this.angles = angles.map((value) => RAD * value)
    this._quad = null
  }

  get paths() {
    const paths = []
    this._angles.forEach((angle) => {
      if (angle === ZERO || angle <= POINT_ANGLE && angle % RIGHT_ANGLE === ZERO) {
        paths.push(this.radius)
        return
      }
      this._quad = this._getQuadrant(angle)
      angle = this._quad !== Quadrant.FIRST ? this._quad - angle : angle
      const radAngle = this._degToRad(angle)
      const hyp = this._chordLength(radAngle)
      // RAT: Right Angle Triangle
      // These are the angles of a RAT that overlaps the circle
      // with its hypotenuse being the chord that closes the
      // inner "cut" triangle
      // angleAofRAT = 90 or what else do you think.
      const angleCofRAT = this._getLastTwoEqAngles(radAngle)
      const angleBofRAT = RIGHT_ANGLE - angleCofRAT
      // what would be the path is the `opp` side with respect
      // to `angleBofRAT` i.e the line that faces it.
      paths.push(this._findOppUseSOH(this._degToRad(angleBofRAT), hyp))
    })
    return paths
  }

  // private
  _degToRad(deg) {
    return RAD * deg
  }

  _radToDeg(rad) {
    return DEG * rad
  }

  _findOppUseSOH(angle, hyp) {
    return Math.sin(angle) * hyp
  }

  /**
   * Finds the value of the last two equal angles in the
   * triangle cut out of the circle.
   * There are three angles, one is given as `angleA`;
   * the other two are equal since two sides `b` & `c` are
   * equal i.e `b = c = radius`
   *
   * @param {number} angleA an angle in degree of the only unequal
   * part of the triangle
   * @returns {number} an angle in degree that reps the angle of the
   * two equal sides of the triangle
   */
  _getLastTwoEqAngles(angleA) {
    return (POINT_ANGLE * HALF - this._radToDeg(angleA)) * HALF
  }

  _getQuadrant(angle) {
    let quad
    [
      Quadrant.FOURTH,
      Quadrant.THIRD,
      Quadrant.SECOND,
      Quadrant.FIRST
    ].forEach((value, index, array) => {
      if (angle > value) {
        quad = array[--index]
      } else {
        quad = array[index]
      }
    })
    return quad
  }

  _chordLength(angle) {
    const radiusSq = this.radius ** 2
    /**
     * cosine rule [`a**2 = b**2 + c**2 - 2bc cos A`]
     *
     * `2 * radiusSq` stands as `b**2 + c**2`.
     * Therefore `b**2 + c**2 = 2bc` since `b = c = radius`.
     * Where `b` & `c` are two sides of a triangle cut
     * from the circle, enclosed with a chord, with the `theta`
     * joining them equal `angle`
     *
     * `angle` is the angle `theta` between the two radii
     * drawn from the centre of the circle
     */
    // a = a**2
    let a = 2 * radiusSq - 2 * radiusSq * Math.cos(angle)
    a = Math.sqrt(a)
    return a
  }
}
