export class Rectangle {
  constructor(...paths) {
    if (paths.length === 4) {
      const [x1, y1, x2, y2] = paths
      this.coordsX = {
        x1,
        x2
      }
      this.coordsY = {
        y1,
        y2
      }
    } else if (paths.length === 2) {
      const {
        x1, y1
      } = paths[0]
      const {
        x2, y2
      } = paths[1]
      this.coordsX = {
        x1,
        x2
      }
      this.coordsY = {
        y1,
        y2
      }
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
