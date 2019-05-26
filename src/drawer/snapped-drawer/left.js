import {
  Path,
  ZERO,
  validateThreshold
} from './../../util'
import {
  VectorRectangle
} from './../vector'

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
const THRESHOLD_VALUE = 0.667
const FALSE_TOUCH_START_POINT = 2

export default class Left {
  /**
   * @param {{}} options
   * an object containing all required properties
   * @param {Bound} bound a boundary object
   */
  constructor(options, bound) {
    this.options = options
    this.bound = bound
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
    this._winSize = this.options.sizeOfWindow || Left._windowSize
    this.winSize = this._winSize()
    /**
     * @type {number}
     */
    this.width = this.options.SIZE
    this.unit = this.options.unit || UNIT
    /**
     * @type {number}
     * A maximum area where the draw-start is sensitive
     * Use set boundary (`bound`) if there's an initial
     * offset
     */
    this.maxArea = this.bound.lower || this.options.maxStartArea || MAX_START_AREA

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
    this.timing.start = new Date()
    const start = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.startX = start
    this.startY =  e.changedTouches[0].pageY || e.changedTouches[0].clientY
    /**
     * The `Drawer`'s `Left` class uses the `CSS property`, `left`
     * for updating and defining position of the drawn element
     */
    const currentPosition = parseFloat(
      Left._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const bound = this.bound
    this.positionOnStart = currentPosition
    const dimension = bound.lower ? `-${bound.upper - bound.lower}${this.unit}` : `-${bound.upper - start}${this.unit}`
    const displacement = `-${bound.upper - FALSE_TOUCH_START_POINT}${this.unit}`

    if (start >= ZERO && start <= this.maxArea && currentPosition !== ZERO) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: dimension,
        [DISPLACEMENT]: displacement
      }
      fn.call(this._context, response, new Path(this.startX, this.startY))
    }
  }

  /**
   * The `touchmove` event handler for the `Left` drawer `class`
   * @param {TouchEvent} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchmove` event.
   * @param {Function} fn - a callback function called when the `move`
   * event is triggered
   * @returns {void}
   */
  move(e, fn) {
    /* eslint complexity: ["error", 25] */
    const resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.resumeX = resume
    this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY

    const currentPosition = parseFloat(
      Left._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const bound = this.bound
    const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN
    const start = this.startX
    const width = bound.upper || this.width
    /**
     * When the touch doesn't start from the max-width
     * of the element ignore `start` and use `width`
     * as starting point.
     */
    const virtualStart = start > width ? width : start
    /**
     * Dimension for opening. When the drawer is being opened,
     * the `width` is the max dimension, and the `start` can
     * only be less than the `width` (from a range of `0` to
     * `this.maxArea` e.g `0` - `25`), so the current
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
    const rect = new VectorRectangle(
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
    if (start >= ZERO && (start <= this.maxArea || start <= width + currentPosition) &&
    currentPosition !== ZERO && isBoundX && nextAction === OPEN &&
    this.scrollControl && rect.displacementX > ZERO) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: dimension,
        open: true,
        close: false
      }
      fn.call(this._context, response, rect)
    }

    // CLOSE LOGIC
    if (resume <= width && Math.abs(currentPosition) < width - bound.lower &&
    isBoundX && nextAction === CLOSE && this.scrollControl && rect.displacementX < ZERO) {
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
   * The `touchend` event handler for the `Left` drawer `class`
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

    const end = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.endX = end
    this.endY = e.changedTouches[0].pageY || e.changedTouches[0].clientY

    const rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY)

    const start = this.startX
    const TIMING = this.timing.end.getTime() - this.timing.start.getTime()
    const threshold = this.threshold
    const signedOffsetSide = parseFloat(
      Left._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const bound = this.bound
    const nonZero = `${bound.slack}${this.unit}`
    const zero = `${ZERO}`
    const width = bound.upper || this.width
    const offsetSide = Math.abs(signedOffsetSide)
    let action = OPEN
    // release the control for another session
    this.scrollControl = this.scrollControlSet = false // eslint-disable-line no-multi-assign

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
    this.startX = -1
    this.startY = -1
    this.resumeX = -1
    this.resumeY = -1
    this.endX = -1
    this.endY = -1

    // OPEN LOGIC
    if (rect.displacementX > ZERO && (start <= this.maxArea || start <= width + signedOffsetSide)) {
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
    if (rect.displacementX < ZERO && this.resumeX <= this.width) {
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
}
