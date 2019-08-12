import {
  Bound,
  DrawerResponseInterface as DRI,
  Path,
  WINDOW,
  ZERO,
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
    const start = touchEvent.changedTouches[0].clientX
    this.startX = start
    this.startY = touchEvent.changedTouches[0].clientY
    /**
     * The `Drawer`'s `Left` class uses the `CSS property`, `left`
     * for updating and defining position of the drawn element
     */
    const currentPosition = this.element.offsetLeft
    const bound = this.bound
    this.positionOnStart = currentPosition
    const dimension = bound.lower ? `-${bound.upper - bound.lower}${this.unit}` : `-${bound.upper - start}${this.unit}`
    const displacement = `-${bound.upper - FALSE_TOUCH_START_POINT}${this.unit}`

    if (start >= ZERO && start <= this.maxArea && currentPosition === bound.slack) {
      const response = {
        [DRI.position]: currentPosition,
        [DRI.dimension]: dimension,
        [DRI.displacement]: displacement
      }
      fn.call(this._context, new Service(touchEvent), response, new Path(this.startX, this.startY))
    }
  }

  /**
   * The `touchmove` event handler for the `Left` drawer `class`
   * @param {TouchEvent} touchEvent an event `object`: An event `object`
   * representing an `object` of all `properties` related
   * to the `touchmove` event.
   * @param {Function} fn - a callback function called when the `move`
   * event is triggered
   * @returns {void}
   */
  move(touchEvent, fn) {
    /* eslint complexity: ["error", 25] */
    const resume = touchEvent.changedTouches[0].clientX
    this.resumeX = resume
    this.resumeY = touchEvent.changedTouches[0].clientY

    const currentPosition = this.element.offsetLeft
    const bound = this.bound
    // const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN
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

    const dimension = `${-start + resume + this.positionOnStart}${this.unit}`
    // const dimension = `-${width - bound.lower - resume}${this.unit}`
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
    const vdimension = `-${virtualStart - resume - this.positionOnStart}${this.unit}`
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
    currentPosition < ZERO && rect.width < bound.gap && isBoundX &&
    this.scrollControl && rect.displacementX > ZERO) {
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
    if (resume <= width && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap &&
    isBoundX && this.scrollControl && rect.displacementX < ZERO) {
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
   * The `touchend` event handler for the `Left` drawer `class`
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

    const end = touchEvent.changedTouches[0].clientX
    this.endX = end
    this.endY = touchEvent.changedTouches[0].clientY

    const rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY)

    const start = this.startX
    const TIMING = this.timing.end.getTime() - this.timing.start.getTime()
    const threshold = this.threshold
    const signedOffsetSide = this.element.offsetLeft
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
    if (rect.displacementX >= ZERO && (start <= this.maxArea || start <= width + signedOffsetSide)) {
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
    if (rect.displacementX <= ZERO && this.resumeX <= width) {
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
    return WINDOW.screen.width
  }

  // window size is not needed here; at least not yet
  // the major purpose of this is to update bound dependents
  _updateOrientation() {
    this.winSize = typeof this._winSize === 'function' ? this._winSize() : Left._windowSize()
    this.minArea = this.bound.lower || this.options.maxStartArea || MAX_START_AREA
  }
}
