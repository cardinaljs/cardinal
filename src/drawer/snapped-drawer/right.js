import {
  ZERO,
  validateThreshold
} from './../../util'
import {
  Rectangle
} from './../rectangle'

const DIRECTION = 'right'
const DIMENSION = 'dimension'
const DISPLACEMENT = 'displacement'
const EVENT_OBJ = 'event'
const THRESHOLD = 'threshold'
const BELOW_THRESHOLD = 'belowthreshold'
const OPEN = 'open'
const CLOSE = 'close'
const UNIT = 'px'
const MAX_START_AREA = 25
const THRESHOLD_VALUE = 0.667
const FALSE_TOUCH_START_POINT = 2

export default class Right {
  /**
   *
   * @param {*} options
   * an object containing all required properties
   */
  constructor(options) {
    this.options = options
    /**
     * Drawer Element
     * @type {HTMLElement}
     */
    this.element = options.ELEMENT
    /**
     * Size of device window
     *
     * unused: required in `Right` and `Bottom`
     * @type {Function}
     */
    this._winSize = this.options.sizeOfWindow || Right._windowSize
    /**
     * @type {number}
     */
    this.winSize = this._winSize()
    /**
     * @type {number}
     */
    this.width = this.options.SIZE
    this.unit = this.options.unit || UNIT
    /**
     * @type {number}
     * A minimum area where the draw-start is sensitive
     */
    this.minArea = this.winSize - (this.options.maxStartArea || MAX_START_AREA)

    /**
     * A threshold which the `touchmove` signal must attain
     * before being qualified to stay shown
     * the threshold should be a value between `0` and `1.0`
     * @type {number}
     */
    this.threshold = this.options.threshold || THRESHOLD_VALUE
    this.threshold = validateThreshold(this.threshold)

    // Touch coordinates (Touch Start)
    this.startX = -1
    this.startY = -1
    // Touch coordinates (Touch Move)
    this.resumeX = -1
    this.resumeY = -1
    // Touch coordinates (Touch End) [these may not be important]
    this.endX = -1
    this.endY = -1

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

    this._context = this
  }

  /**
   * The `touchstart` event handler for the `Left` drawer `class`
   * @param {TouchEvent} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchstart` event.
   * @param {Function} fn - a callback function called when the `start`
   * event is triggered
   * @returns {void}
   */
  start(e, fn) {
    this._loopWinSizeChangeEvent()
    const WIN_WIDTH = this.winSize
    this.timing.start = new Date()
    const start = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.startX = start
    this.startY =  e.changedTouches[0].pageY || e.changedTouches[0].clientY
    /**
     * The `Drawer`'s `Left` class uses the `CSS property`, `left`
     * for updating and defining position of the drawn element
     */
    const currentPosition = parseFloat(
      Right._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    this.positionOnStart = currentPosition
    const dimension = `-${this.width - (WIN_WIDTH - start)}${this.unit}`
    const displacement = `-${this.width - (WIN_WIDTH - FALSE_TOUCH_START_POINT)}${this.unit}`

    if (start <= WIN_WIDTH && start >= this.minArea && currentPosition !== ZERO) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: dimension,
        [DISPLACEMENT]: displacement
      }
      fn.call(this._context, response, new Rectangle(this.startX, this.startY, -1, -1))
    }
  }

  /**
   * The `touchmove` event handler for the `Right` drawer `class`
   * @param {TouchEvent} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchmove` event.
   * @param {Function} fn - a callback function called when the `move`
   * event is triggered
   * @returns {void}
   */
  move(e, fn) {
    const WIN_WIDTH = this.winSize
    const FALSE_WIDTH = WIN_WIDTH - this.width
    const resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.resumeX = resume
    this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY

    const currentPosition = parseFloat(
      Right._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN

    const start = this.startX
    const width = this.width
    /**
     * When the touch doesn't start from the max-width
     * of the element ignore `start` and use `width`
     * as starting point.
     */
    const virtualStart = start < FALSE_WIDTH ? FALSE_WIDTH : start

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
     * *__If it should be respected then:__*,
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
    const dimension = `-${width - (WIN_WIDTH - resume)}${this.unit}`

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
    const rect = new Rectangle(
      this.startX,
      this.startY,
      this.resumeX,
      this.resumeY
    )
    const isBoundX = rect.greaterWidth

    if (!this.scrollControlSet) {
      this.scrollControl = isBoundX
      this.scrollControlSet = !this.scrollControlSet
    }

    // OPEN LOGIC
    if (start <= WIN_WIDTH && start >= this.minArea && currentPosition !== ZERO && isBoundX && nextAction === OPEN && this.scrollControl && rect.displacementX < ZERO) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: dimension,
        open: true,
        close: false
      }
      fn.call(this._context, response, rect)
    }

    // CLOSE LOGIC
    if (resume >= FALSE_WIDTH && currentPosition <= this.width && isBoundX && nextAction === CLOSE && this.scrollControl && rect.displacementX > ZERO) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: vdimension,
        close: true,
        open: false
      }
      fn.call(this._context, response, rect)
    }
  }

  /**
   * The `touchend` event handler for the `Right` drawer `class`
   * @param {TouchEvent} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchend` event.
   * @param {Function} fn - a callback function called when the `end`
   * event is triggered
   * @param {{}} thresholdState - a state object which should be passed
   * by reference for updating by this method
   * @returns {void}
   */
  end(e, fn, thresholdState) {
    this.timing.end = new Date()
    const WIN_WIDTH = this.winSize
    const FALSE_WIDTH = WIN_WIDTH - this.width
    const end = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.endX = end
    this.endY = e.changedTouches[0].pageY || e.changedTouches[0].clientY

    const rect = new Rectangle(this.startX, this.startY, this.endX, this.endY)

    const start = this.startX
    const TIMING = this.timing.end.getTime() - this.timing.start.getTime()
    const threshold = this.threshold
    const signedOffsetSide = parseFloat(
      Right._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const nonZero = `-${this.width}px`
    const zero = `${ZERO}`
    const offsetSide = Math.abs(signedOffsetSide)
    let action = OPEN
    // release the control for another session
    this.scrollControl = this.scrollControlSet = false // eslint-disable-line no-multi-assign

    const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN
    const response = {
      [EVENT_OBJ]: e,
      position: signedOffsetSide,
      rect
    }

    function getResponse(state, trueForOpen) {
      const opposite = 'oppositeDimension'
      if (state === THRESHOLD && trueForOpen || state === BELOW_THRESHOLD && !trueForOpen) {
        return {
          [DIMENSION]: zero,
          TIMING,
          [opposite]: nonZero,
          ...response
        }
      } else if (state === THRESHOLD && !trueForOpen || state === BELOW_THRESHOLD && trueForOpen) {
        return {
          [DIMENSION]: nonZero,
          TIMING,
          [opposite]: zero,
          ...response
        }
      }
      return {}
    }

    // OPEN LOGIC
    if (nextAction === OPEN && start >= this.minArea) {
      if (offsetSide <= this.width * threshold) {
        thresholdState.state = [THRESHOLD, CLOSE]
        thresholdState.stateObj = getResponse(thresholdState.state[0], true)
      } else {
        thresholdState.state = [BELOW_THRESHOLD, CLOSE]
        thresholdState.stateObj = getResponse(thresholdState.state[0], true)
      }
      fn.call(this, action)
      return
    }

    // CLOSE LOGIC
    if (nextAction === CLOSE && rect.displacementX > ZERO && FALSE_WIDTH - this.resumeX <= this.width) {
      action = CLOSE
      if (offsetSide >= this.width * threshold) {
        thresholdState.state = [THRESHOLD, OPEN]
        thresholdState.stateObj = getResponse(thresholdState.state[0], false)
      } else {
        thresholdState.state = [BELOW_THRESHOLD, OPEN]
        thresholdState.stateObj = getResponse(thresholdState.state[0], false)
      }
      fn.call(this, action)
    }
  }

  setContext(ctx) {
    this._context = ctx
    return this
  }

  static _getStyle(elt, pseudoElt) {
    return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt)
  }

  static _windowSize() {
    return window.screen.availWidth
  }

  // no need for `window.onorientationchange`
  _loopWinSizeChangeEvent(getHandler) {
    const fn = () => {
      this.winSize = typeof this.winSize === 'function' ? this._winSize() : Right._windowSize()
      this.minArea = this.winSize - (this.options.maxStartArea || MAX_START_AREA)
    }
    if (getHandler) {
      return fn
    }
    window.setInterval(fn, 1e3)
  }
}
