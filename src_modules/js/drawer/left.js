import Final from './constvars'
import Rectangle from './rectangle'

const DIRECTION = 'left'
const DIMENSION = 'dimension'
const DISPLACEMENT = 'displacement'
const EVENT_OBJ = 'event'
const THRESHOLD = 'threshold'
const BELOW_THRESHOLD = 'belowthreshold'
const OPEN = 'open'
const CLOSE = 'close'
const UNIT = 'px'
const MAX_START_AREA = 25
const THRESHOLD_VALUE = 0.3333

export default class Left {
  /**
   *
   * @param {{}} options
   * an object containing all required properties
   */
  constructor(options) {
    this.options = options
    /**
     * @type {HTMLElement}
     */
    this.element = options.ELEMENT
    /**
     * Size of device window
     * @type {number}
     */
    this.winSize = this.options.sizeOfWindow || window.screen.availWidth
    /**
     * @type {number}
     */
    this.width = this.element.offsetWidth
    this.unit = this.options.unit || UNIT
    /**
     * @type {number}
     * A maximum area where the draw-start is sensitive
     */
    this.maxArea = this.options.maxStartArea || MAX_START_AREA

    /**
     * A threshold which the `touchmove` signal must attain
     * before being qualified to stay shown
     * the threshold should be a value between `0` and `1.0`
     * @type {number}
     */
    this.threshold = this.options.threshold || THRESHOLD_VALUE

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
     * @type {boolean}
     */
    this.scrollControlSet = false
    this.scrollControl = null
    this.timing = {
      /**
       * @type {Date}
       */
      start: null,
      /**
       * @type {Date}
       */
      end: null
    }

    this.context = null
  }

  /**
   * The `touchstart` event handler for the `Left` drawer `class`
   * @param {{}} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchstart` event.
   * @param {Function} fn - a callback function called when the `start`
   * event is triggered
   */
  start(e, fn) {
    this.timing.start = new Date()
    const start = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.startX = start
    this.startY =  e.changedTouches[0].pageY || e.changedTouches[0].clientY
    /**
     * The `Drawer`'s `Left` class uses the `CSS property` -- `left`
     * for updating and defining position of the drawn element
     */
    const currentPosition = parseFloat(
      Left._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const dimension = `-${this.width - start}${this.unit}`
    const displacement = `-${this.width - Final.START}${this.unit}`

    if (start >= Final.ZERO && start <= this.maxArea && currentPosition !== Final.ZERO) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: dimension,
        [DISPLACEMENT]: displacement
      }
      fn.call(this.context || this, response, new Rectangle(this.startX, this.startY, -1, -1))
      // this.element.style.left = displacement || dimension
      // Block every scroll job on the screen
      // document.body.style.overflow = Final.HIDDEN
    }
  }

  /**
   * The `touchstart` event handler for the `Left` drawer `class`
   * @param {{}} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchmove` event.
   * @param {Function} fn - a callback function called when the `move`
   * event is triggered
   */
  move(e, fn) {
    const resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.resumeX = resume
    this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY

    const currentPosition = parseFloat(
      Left._getStyle(this.element)[DIRECTION].replace(
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
    const virtualStart = start > width ? width : start
    /**
     * Dimension for opening. When the drawer is being opened,
     * the `width` is the max dimension, and the `start` can
     * only be less than the `width` (from a range of `0` to `this.maxArea` e.g `0` - `25`), so the current
     * reading from `resume` is subtracted from the `width` to
     * get the accurate position to update the drawer with.
     */
    const dimension = `-${width - resume}${this.unit}`
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
    const vdimension = `-${virtualStart - resume}${this.unit}`
    const backdropSheet = {
      opacity: resume / width,
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

    // OPEN LOGIC
    if (start >= Final.ZERO && start <= this.maxArea && currentPosition !== Final.ZERO && isBoundX && this.scrollControl) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: dimension,
        open: true,
        close: false
      }
      fn.call(this, response, rect)
      // this.element.style[DIRECTION] = dimension
    }

    // CLOSE LOGIC
    else if (start <= this.width && currentPosition === Final.ZERO && isBoundX && this.scrollControl) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: vdimension,
        close: true,
        open: false
      }
      fn.call(this, response, rect)
      // this.element.style[DIRECTION] = vdimension
    } else {
      return
    }
  }

  /**
   * The `touchstart` event handler for the `Left` drawer `class`
   * @param {{}} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchend` event.
   * @param {Function} fn - a callback function called when the `end`
   * event is triggered
   * @param {{}} thresholdState - a state object which should be passed
   * by reference for updating by this method
   */
  end(e, fn, thresholdState) {
    this.timing.end = new Date()

    const TIMING = this.timing.end.getTime() - this.timing.start.getTime()
    const threshold = this.threshold
    const signedOffsetSide = parseFloat(
      Left._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const nonZero = `-${this.width}px`
    const zero = `${Final.ZERO}`
    const offsetSide = Math.abs(signedOffsetSide)
    let action = OPEN
    // release the control for another session
    this.scrollControl = this.scrollControlSet = false

    const response = {
      [EVENT_OBJ]: e,
      position: signedOffsetSide,
    }

    const getResponse = (state, trueForOpen) => {
      return state === THRESHOLD && trueForOpen ? {
        [DIMENSION]: zero,
        TIMING,
        ...response
      } : state === THRESHOLD && !trueForOpen ? {
        [DIMENSION]: nonZero,
        TIMING,
        ...response
      } : state === BELOW_THRESHOLD && trueForOpen ? {
        [DIMENSION]: nonZero,
        TIMING,
        ...response
      } : {
        [DIMENSION]: zero,
        TIMING,
        ...response
      }
    }

    // OPEN LOGIC
    if (offsetSide <= (this.width/threshold) && this.startX <= this.maxArea) {
      thresholdState.state = [THRESHOLD, CLOSE]
      thresholdState.stateObj = getResponse(thresholdState.state[0], true)
      // this.element.style[DIRECTION] = zero
    } else {
      thresholdState.state = [BELOW_THRESHOLD, CLOSE]
      thresholdState.stateObj = getResponse(thresholdState.state[0], true)
      // this.element.style[DIRECTION] = nonZero
    }

    // CLOSE LOGIC
    if (start > this.maxArea && offsetSide != this.width) {
      action = CLOSE
      if (offsetSide > this.width / threshold) {
        thresholdState.state = [THRESHOLD, OPEN]
        thresholdState.stateObj = getResponse(thresholdState.state, false)
        // this.element.style[DIRECTION] = nonZero
      } else {
        thresholdState.state = [BELOW_THRESHOLD, OPEN]
        thresholdState.stateObj = getResponse(thresholdState.state, false)
        // this.element.style[DIRECTION] = zero
      }
    }
    fn.call(this, action)
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
