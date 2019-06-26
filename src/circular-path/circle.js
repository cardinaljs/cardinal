export const POINT_ANGLE = 360
export const PI = Math.PI
export const RAD = PI / (POINT_ANGLE >> 1)

export class Circle {
  constructor(radius) {
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

  arc(angle) {
    angle *= RAD
    return angle / POINT_ANGLE * this.circumference
  }
}
