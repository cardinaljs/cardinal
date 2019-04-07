import Final from './constvars'

export default class Top {
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
    this.maxArea = this.options.maxStartArea
  }

  start(e) {
    let start = e.changedTouches[0].pageY || e.changedTouches[0].clientY
    let startX =  e.changedTouches[0].pageX || e.changedTouches[0].clientX
    /**
     * The `Drawer`'s `Top` class uses the `CSS property` `top`
     * for updating and defining position of the drawn element
     */
    let currentPosition = parseFloat(
      this.element.style.top.replace(
        /[^\d]*$/, ''
      )
    )
    let dimension = `-${this.height - start}${this.unit}`
    let displacement = `-${this.height - Final.START}${this.unit}`

    if (start >= Final.ZERO && start <= this.maxArea && currentPosition != Final.ZERO) {
      this.element.style.top = displacement || dimension
      // Block every scroll job on the screen
      document.body.style.overflow = Final.HIDDEN
    }
  }

  move() {

  }

  end() {

  }
}
