import {
  Bound,
  DrawerResponseInterface as DRI,
  Path,
  WINDOW,
  ZERO,
  offsetRight,
  resolveThreshold
} from './../../util'
import {
  Service
} from './../service'
import {
  VectorRectangle
} from './../vector'

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
    this.minArea = this.winSize - (this.bound.lower || this.options.maxStartArea || MAX_START_AREA)

    /**
     * A threshold which the `touchmove` signal must attain
     * before being qualified to stay shown
     * the threshold should be a value between `0` and `1.0`
     * @type {number}
     */
    this.threshold = this.options.threshold || THRESHOLD_VALUE
    this.threshold = resolveThreshold(this.threshold)

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
   * @param {TouchEvent} touchEvent an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchstart` event.
   * @param {Function} fn - a callback function called when the `start`
   * event is triggered
   * @returns {void}
   */
  start(touchEvent, fn) {
    this.timing.start = new Date()
    this._updateOrientation()
    const WIN_WIDTH = this.winSize
    const start = touchEvent.changedTouches[0].clientX
    this.startX = start
    this.startY = touchEvent.changedTouches[0].clientY
    /**
     * The `Drawer`'s `Right` class uses the `CSS property`, `right`
     * for updating and defining position of the drawn element
     */
    const currentPosition = offsetRight(this.element)
    const bound = this.bound
    this.positionOnStart = currentPosition
    const dimension = bound.lower ? `-${bound.upper - bound.lower}${this.unit}` : `-${bound.upper - (WIN_WIDTH - start)}${this.unit}`
    const displacement = `-${bound.upper - FALSE_TOUCH_START_POINT}${this.unit}`

    if (start <= WIN_WIDTH && start >= this.minArea && currentPosition === bound.slack) {
      const response = {
        [DRI.position]: currentPosition,
        [DRI.dimension]: dimension,
        [DRI.displacement]: displacement
      }
      fn.call(this._context, new Service(touchEvent), response, new Path(this.startX, this.startY))
    }
  }

  /**
   * The `touchmove` event handler for the `Right` drawer `class`
   * @param {TouchEvent} touchEvent an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchmove` event.
   * @param {Function} fn - a callback function called when the `move`
   * event is triggered
   * @returns {void}
   */
  move(touchEvent, fn) {
    /* eslint complexity: ["error", 25] */
    const WIN_WIDTH = this.winSize
    const FALSE_WIDTH = WIN_WIDTH - this.bound.upper
    const resume = touchEvent.changedTouches[0].clientX
    this.resumeX = resume
    this.resumeY = touchEvent.changedTouches[0].clientY

    const currentPosition = offsetRight(this.element)
    const bound = this.bound
    // const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN

    const start = this.startX
    const width = bound.upper || this.width
    /**
     * When the touch doesn't start from the max-width
     * of the element ignore `start` and use `width`
     * as starting point.
     */
    const virtualStart = start < FALSE_WIDTH ? FALSE_WIDTH : start

    const dimension = `${start - resume + this.positionOnStart}${this.unit}`
    // const dimension = `-${width - bound.lower - (WIN_WIDTH - resume)}${this.unit}`

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
    const vdimension = `-${-virtualStart + resume - this.positionOnStart}${this.unit}`
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
    if (start <= WIN_WIDTH && (start >= this.minArea || start >= FALSE_WIDTH - currentPosition) &&
    currentPosition < ZERO && isBoundX &&/* nextAction === OPEN &&*/
    this.scrollControl && rect.displacementX < ZERO) {
      const response = {
        [DRI.position]: currentPosition,
        [DRI.posOnStart]: this.positionOnStart,
        [DRI.dimension]: dimension,
        [DRI.open]: true,
        [DRI.close]: false
      }
      fn.call(this._context, new Service(touchEvent), response, rect)
    }

    // CLOSE LOGIC
    if (resume >= FALSE_WIDTH && Math.abs(currentPosition) < width - bound.lower &&
    isBoundX &&/* nextAction === CLOSE &&*/ this.scrollControl && rect.displacementX > ZERO) {
      const response = {
        [DRI.position]: currentPosition,
        [DRI.posOnStart]: this.positionOnStart,
        [DRI.dimension]: vdimension,
        [DRI.close]: true,
        [DRI.open]: false
      }
      fn.call(this._context, new Service(touchEvent), response, rect)
    }
  }

  /**
   * The `touchend` event handler for the `Right` drawer `class`
   * @param {TouchEvent} touchEvent an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchend` event.
   * @param {Function} fn - a callback function called when the `end`
   * event is triggered
   * @param {{}} thresholdState - a state object which should be passed
   * by reference for updating by this method
   * @returns {void}
   */
  end(touchEvent, fn, thresholdState) {
    this.timing.end = new Date()
    const WIN_WIDTH = this.winSize
    const FALSE_WIDTH = WIN_WIDTH - this.bound.upper
    const end = touchEvent.changedTouches[0].clientX
    this.endX = end
    this.endY = touchEvent.changedTouches[0].clientY

    const rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY)

    const start = this.startX
    const TIMING = this.timing.end.getTime() - this.timing.start.getTime()
    const threshold = this.threshold
    const signedOffsetSide = offsetRight(this.element)
    const bound = this.bound
    const customBound = new Bound(bound.upper + this.positionOnStart, bound.upper)
    const nonZero = `${bound.slack}${this.unit}`
    const zero = `${ZERO}`
    const width = bound.upper || this.width
    const offsetSide = Math.abs(signedOffsetSide)
    let action = OPEN
    // release the control for another session
    this.scrollControl = this.scrollControlSet = false // eslint-disable-line no-multi-assign

    const response = {
      [DRI.position]: signedOffsetSide,
      [DRI.posOnStart]: this.positionOnStart,
      rect
    }

    function getResponse(state, trueForOpen) {
      if (state === THRESHOLD && trueForOpen || state === BELOW_THRESHOLD && !trueForOpen) {
        return {
          [DRI.dimension]: zero,
          TIMING,
          [DRI.oppositeDimension]: nonZero,
          ...response
        }
      } else if (state === THRESHOLD && !trueForOpen || state === BELOW_THRESHOLD && trueForOpen) {
        return {
          [DRI.dimension]: nonZero,
          TIMING,
          [DRI.oppositeDimension]: zero,
          ...response
        }
      }
      return {}
    }

    // OPEN LOGIC
    if (rect.displacementX < ZERO && (start >= this.minArea || start >= FALSE_WIDTH - signedOffsetSide)) {
      if (rect.width >= customBound.gap * resolveThreshold(threshold)) {
        thresholdState.state = [THRESHOLD, CLOSE]
        thresholdState.stateObj = getResponse(thresholdState.state[0], true)
      } else {
        thresholdState.state = [BELOW_THRESHOLD, CLOSE]
        thresholdState.stateObj = getResponse(thresholdState.state[0], true)
      }
      thresholdState.service = new Service(touchEvent)
      fn.call(this, action)
      return
    }

    // CLOSE LOGIC
    if (rect.displacementX > ZERO && this.resumeX >= FALSE_WIDTH) {
      action = CLOSE
      if (offsetSide >= width * threshold) {
        thresholdState.state = [THRESHOLD, OPEN]
        thresholdState.stateObj = getResponse(thresholdState.state[0], false)
      } else {
        thresholdState.state = [BELOW_THRESHOLD, OPEN]
        thresholdState.stateObj = getResponse(thresholdState.state[0], false)
      }
      thresholdState.service = new Service(touchEvent)
      fn.call(this, action)
    }
  }

  setContext(ctx) {
    this._context = ctx
    return this
  }

  static _getStyle(elt, pseudoElt) {
    return pseudoElt ? WINDOW.getComputedStyle(elt, pseudoElt) : WINDOW.getComputedStyle(elt)
  }

  static _windowSize() {
    return WINDOW.screen.availWidth
  }

  // no need for `window.onorientationchange`
  _updateOrientation() {
    this.winSize = typeof this._winSize === 'function' ? this._winSize() : Right._windowSize()
    this.minArea = this.winSize - (this.bound.lower || this.options.maxStartArea || MAX_START_AREA)
  }
}
