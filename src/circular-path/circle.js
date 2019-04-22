export const POINT_ANGLE = 360
export const HALF = 1 / 2
export const PI = Math.PI
export const RAD = PI / (POINT_ANGLE * HALF)

export class Circle {
  constructor(radius) {
    /**
     * @type {number}
     */
    this.radius = radius
    this.diameter = this.radius * 2
  }

  get area() {
    return PI * this.radius ** 2
  }

  get circumference() {
    return 2 * PI * this.radius
  }

  areaOfSect(angle) {
    angle *= RAD
    return angle / POINT_ANGLE * this.area
  }

  lenOfSect(angle) {
    angle *= RAD
    return angle / POINT_ANGLE * this.circumference
  }
}
