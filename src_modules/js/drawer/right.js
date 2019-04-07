import Final from './constvars'

const DIRECTION = 'right'
const DIMENSION = 'dimension'
const DISPLACEMENT = 'displacement'
const EVENT_OBJ = 'event'
const THRESHOLD = 'threshold'
const BELOW_THRESHOLD = 'belowthreshold'

export default class Right {
  /**
   *
   * @param {*} options
   * an object containing all required properties
   */
  constructor(options) {
    this.options = options
    // the target element, not listening to,
    // but reacting to event
    this.element = options.ELEMENT
    /**
     * @type number
     * Size of device window in pixels
     */
    this.winSize = this.options.sizeOfWindow || window.screen.availWidth
    /**
     * @type number
     * A numerical representation of the
     * target element's width
     */
    this.width = this.element.offsetWidth
    this.unit = this.options.UNIT
    /**
     * @type number
     * A maximum area where the draw-start is sensitive
     */
    this.maxArea = this.winSize - this.options.maxStartArea

    /**
     * A threshold which the `touchmove` signal must attain
     * before being qualified to stay shown
     * the threshold should be a value between `1.0` and `0`
     * @type number
     */
    this.threshold = this.options.threshold

    // Touch coordinates (Touch Start)
    this.startX = -1
    this.startY = -1
    // Touch coordinates (Touch Move)
    this.resumeX = -1
    this.resumeY = -1

    /**
     * A control for scroll. This control prevents
     * a clash between coordinates dancing between
     * the (&delta;`X`) coords and (&delta;`Y`) coords.
     * Utilising the `Rectangle` class to get bounds
     * and isolate territories
     * @type boolean
     */
    this.scrollControlSet = false
    this.scrollControl = null
  }

  start() {
    const start = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.startX = start
    this.startY =  e.changedTouches[0].pageY || e.changedTouches[0].clientY
    /**
     * The `Drawer`'s `Right` class uses the `CSS property` `Right`
     * for updating and defining position of the drawn element
     */
    const currentPosition = parseFloat(
      this.element.style.right.replace(
        /[^\d]*$/, ''
      )
    )
    const dimension = `-${this.width - (this.winSize - start)}${this.unit}`
    const displacement = `-${this.width - Final.START}${this.unit}`

    if (start >= Final.ZERO && start <= this.maxArea && currentPosition !== Final.ZERO) {
      this.element.style.right = displacement || dimension
      // Block every scroll job on the screen
      document.body.style.overflow = Final.HIDDEN
    }
  }

  /**
   * The `touchmove` event handler for the `Right` drawer `class`
   * @param {*} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchstart` event.
   */
  move() {
    const resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.resumeX = resume
    this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY

    const currentPosition = parseFloat(
      this.element.style[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )

    const start = this.startX
    const width = this.width
    /**
     * When the touch doesn't start from the max-width
     * of the element ignore `start` and use `width`
     * as starting point.
     */
    const virtualStart = start < (this.winSize - width) ? this.winSize - width : start
    /**
     * Dimension for opening. When the drawer is being opened,
     * the `width` is the max dimension, and the `start` can
     * only be less than the `width` (from a range of `0` to `this.maxArea` e.g `0` - `25`), so the current
     * reading from `resume` is subtracted from the `width` to
     * get the accurate position to update the drawer with.
     *
     *
     * **WHY IT IS LIKE THIS `width - (this.winSize - resume)`**
     *
     * `this.winSize - resume` converts it from a vector to a scalar.
     * Keeping it as a vector makes the dimension inaccurate
     * as the `right` property of the `HTMLElement.style` is the one being updated and not the left,
     * so the css `right` property is an enough respect for its direction.
     *
     * *__If it should be respected then__*,
     * 1. The `Right Drawer class` would be updating `left css property` and not `right`, i.e, initialy an element that uses the `Right Drawer` must have a `css file` that defines a `css left property` for the element and not a `right` property; As in
     * ```scss
     * .menu {
     *   left: // (window size + width of the element)px
     * }
     * ```
     * 2. Cardinal's `Right Drawer class` can always update
     * as `HTMLElement.style.left = ${width - resume}px`, and
     * not as it is now.
     * This way there is no `right` property respecting the direction
     * So the vector attribute of the dimension is preserved.
     */
    const dimension = `-${width - (this.winSize - resume)}${this.unit}`
    /**
     * Dimension for closing. When the drawer is being closed,
     * the `width` is the max dimension and the `start` could
     * possibly be more than the `width`
     * or less than the `width`.
     * To assure an accurate dimension the `virtualStart`
     * determines whether to use the `width` as starting point
     * or the actual `start`. If the actual start is more than
     * `width`, the width becomes the start point else the `start`
     */
    const vdimension = `-${resume - virtualStart}${this.unit}`
    new Final()
    const backdropSheet = {
      opacity: (this.winSize - resume) / width,
      display: Final.DISPLAY
    }
    const rect = new Rectangle(
      this.startX,
      this.startY,
      this.resumeX,
      this.resumeY
    )
    const isBoundX = rect.wGTh()
    // eslint-disable-next-line no-unused-expression, no-sequence, no-extra-parens
    !this.scrollControlSet &&
    (this.scrollControl = isBoundX), (this.scrollControlset = !this.scrollControlSet)
  }

  end() {

  }
}
