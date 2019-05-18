import {
  ZERO,
  validateThreshold
} from './../../util'
import {
  Rectangle
} from './../rectangle'

const DIRECTION = 'top'
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

export default class Top {
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
    this._winSize = this.options.sizeOfWindow || Top._windowSize
    this.winSize = this._winSize()
    /**
     * @type {number}
     */
    this.height = this.options.SIZE
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
   * The `touchstart` event handler for the `Top` drawer `class`
   * @param {TouchEvent} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchstart` event.
   * @param {Function} fn - a callback function called when the `start`
   * event is triggered
   * @returns {void}
   */
  start(e, fn) {
    this.timing.start = new Date()
    const start =  e.changedTouches[0].pageY || e.changedTouches[0].clientY
    this.startX = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.startY = start
    /**
     * The `Drawer`'s `Top` class uses the `CSS property`, `top`
     * for updating and defining position of the drawn element
     */
    const currentPosition = parseFloat(
      Top._getStyle(this.element)[DIRECTION].replace(
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
      fn.call(this._context, response, new Rectangle(this.startX, this.startY, -1, -1))
    }
  }

  /**
   * The `touchmove` event handler for the `Top` drawer `class`
   * @param {TouchEvent} e an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchmove` event.
   * @param {Function} fn - a callback function called when the `move`
   * event is triggered
   * @returns {void}
   */
  move(e, fn) {
    /* eslint complexity: ["error", 25] */
    const resume = e.changedTouches[0].pageY || e.changedTouches[0].clientY
    this.resumeX = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.resumeY = resume

    const currentPosition = parseFloat(
      Top._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const bound = this.bound
    const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN

    const start = this.startX
    const height = bound.upper || this.height
    /**
     * When the touch doesn't start from the max-height
     * of the element ignore `start` and use `height`
     * as starting point.
     */
    const virtualStart = start > height ? height : start
    /**
     * Dimension for opening. When the drawer is being opened,
     * the `height` is the max dimension, and the `start` can
     * only be less than the `height` (from a range of `0` to
     * `this.maxArea` e.g `0` - `25`), so the current
     * reading from `resume` is subtracted from the `height` to
     * get the accurate position to update the drawer with.
     */
    const dimension = `-${height - resume}${this.unit}`
    /**
     * Dimension for closing. When the drawer is being closed,
     * the `height` is the max dimension and the `start` could
     * possibly be more than the `height`
     * or less than the `height`.
     * To assure an accurate dimension the `virtualStart`
     * determines whether to use the `height` as starting point
     * or the actual `start`. If the actual start is more than
     * `height`, the height becomes the start point else the `start`
     */
    const vdimension = `-${virtualStart - resume}${this.unit}`
    const rect = new Rectangle(
      this.startX,
      this.startY,
      this.resumeX,
      this.resumeY
    )
    const isBoundY = rect.greaterHeight

    if (!this.scrollControlSet) {
      this.scrollControl = isBoundY
      this.scrollControlSet = !this.scrollControlSet
    }

    // OPEN LOGIC
    if (start >= ZERO && (start <= this.maxArea || start <= height + currentPosition) && currentPosition !== ZERO && isBoundY && nextAction === OPEN && this.scrollControl && rect.displacementY > ZERO) {
      const response = {
        [EVENT_OBJ]: e,
        [DIMENSION]: dimension,
        open: true,
        close: false
      }
      fn.call(this._context, response, rect)
    }

    // CLOSE LOGIC
    if (resume <= this.height && Math.abs(currentPosition) < height - bound.lower && isBoundY && nextAction === CLOSE && this.scrollControl && rect.displacementY < ZERO) {
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
   * The `touchend` event handler for the `Top` drawer `class`
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

    const end = e.changedTouches[0].pageY || e.changedTouches[0].clientY
    this.endX = e.changedTouches[0].pageX || e.changedTouches[0].clientX
    this.endY = end

    const rect = new Rectangle(this.startX, this.startY, this.endX, this.endY)

    const start = this.startY
    const TIMING = this.timing.end.getTime() - this.timing.start.getTime()
    const threshold = this.threshold
    const signedOffsetSide = parseFloat(
      Top._getStyle(this.element)[DIRECTION].replace(
        /[^\d]*$/, ''
      )
    )
    const bound = this.bound
    const nonZero = `${bound.slack}${this.unit}`
    const zero = `${ZERO}`
    const height = bound.upper || this.height
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

    // OPEN LOGIC
    if (rect.displacementY > ZERO && (start <= this.maxArea || start <= height + signedOffsetSide)) {
      if (offsetSide <= this.height * threshold) {
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
    if (rect.displacementY < ZERO && this.resumeY <= this.height) {
      action = CLOSE
      if (offsetSide >= this.height * threshold) {
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
    return window.screen.availHeight
  }
}
