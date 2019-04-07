export default class Rectangle {
  /**
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
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

  // getter
  get width() {
    return Math.abs(this.coordsX.x2 - this.coordsX.x1)
  }

  get height() {
    return Math.abs(this.coordsY.y2 - this.coordsY.y1)
  }

  // methods
  wGTh() {
    return this.width() > this.height()
  }

  hGTw() {
    return !this.wGTh()
  }
}
