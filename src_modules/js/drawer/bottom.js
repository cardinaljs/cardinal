import Final from '../util'

export default class Bottom {
  /**
   *
   * @param {*} options
   * an object containing all required properties
   */
  constructor(options) {
    this.options = options
    this.element = options.ELEMENT
    /**
     * Size of device window
     */
    this.winSize = this.options.sizeOfWindow || window.screen.availHeight
    this.height = this.element.offsetHeight
    this.unit = this.options.unit
    /**
     * @type number
     * A maximum area where the draw-start is sensitive
     */
    this.maxArea = this.winSize - this.options.maxStartArea

    this.context = null
  }

  start(e) {
    const start = e.changedTouches[0].pageY || e.changedTouches[0].clientY
    const startX =  e.changedTouches[0].pageX || e.changedTouches[0].clientX
    /**
     * The `Drawer`'s `Top` class uses the `CSS property` `top`
     * for updating and defining position of the drawn element
     */
    const currentPosition = parseFloat(
      this.element.style.bottom.replace(
        /[^\d]*$/, ''
      )
    )
    const dimension = `-${this.height - start}${this.unit}`
    const displacement = `-${this.height - Final.START}${this.unit}`

    if (start >= Final.ZERO && start <= this.maxArea && currentPosition !== Final.ZERO) {
      this.element.style.bottom = displacement || dimension
      // Block every scroll job on the screen
      document.body.style.overflow = Final.HIDDEN
    }
  }

  move() {

  }

  end() {

  }

  setContext(ctx) {
    this.context = ctx
    return this
  }

  static _getStyle(elt, pseudoElt) {
    return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt)
  }

  // no need for `window.onorientationchange`
  _loopWinSizeChangeEvent() {
    window.setInterval(() => {
      this.winSize = window.screen.availWidth
    }, 1e3)
  }
}
