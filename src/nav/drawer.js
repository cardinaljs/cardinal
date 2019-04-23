import Drawer from './../drawer/'

const ZERO = 0
const KILO = 1e3
const MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD = 0.7
const MIN_POSITIVE_DISPLACEMENT = 40
const MIN_NEGATIVE_DISPLACEMENT = -MIN_POSITIVE_DISPLACEMENT
const TRANSITION_STYLE = 'linear'
const EFFECT = 'transition'
const TRANS_TIMING = '0.1s' // This value is basic, the calc'ed value will depend on drawer speed
const TRANS_TEMPLATE = `${TRANSITION_STYLE} ${TRANS_TIMING}`
const HIDDEN = 'hidden'
const SCROLL = 'scroll'
const START = 'start'
const END = 'end'
const THRESHOLD = 'threshold'
const BELOW_THRESHOLD = `below${THRESHOLD}`
const DIRECTIONS = ['top', 'left', 'bottom', 'right']

class NavDrawer {
  /**
   * Creates a new NavDrawer object. Providing the Left and Right
   * Drawer functionality.
   * Support for Top and Bottom may come in the future
   * @throws RangeError
   * @param {{}} options An options Object to configure the Drawer with
   */
  constructor(options) {
    this.options = options
    /**
     * @type {HTMLElement}
     */
    this.element = this.options.ELEMENT
    /**
     * @type {HTMLBodyElement}
     */
    this.body = this.options.BODY
    /**
     * @type {number}
     */
    this.backdrop = this.options.BACKDROP
    /**
     * @type {string}
     */
    this.direction = this.options.DIRECTION
    this.directionString = DIRECTIONS[this.direction]
    this.handlers = []
    this.events = [
      this.options.touchstart,
      this.options.touchmove,
      this.options.touchend
    ]

    let o = {
      ...options,
      TARGET: document
    }
    this.drawer = new BoundDrawer(o)
    this.transition = `${this.directionString} ${TRANS_TEMPLATE}`
  }

  activate() {
    this.drawer.on(START, this._startHandler)
      .on(MOVE, this._moveHandler)
      .on(THRESHOLD, this._threshold)
      .on(BELOW_THRESHOLD, this._belowThreshold)
      .setContext(this)
      .activate()
    return 0
  }

  deactivate() {
    this.drawer.deactivate()
    return 0
  }

  get elementSize() {
    const axis = this.direction
    if (axis === BoundDrawer.UP || axis === BoundDrawer.DOWN) {
      return this.element.offsetHeight
    } else {
      return this.element.offsetWidth
    }
  }

  _startHandler(response, rectangle) {
    this.element.style[this.directionString] = response.displacement
    this.element.style[EFFECT] = this.transition
    this.body.style.overflow = HIDDEN
  }

  _moveHandler(response, rectangle) {
    this.element.style[this.directionString] = response.dimension
    this.element.style[EFFECT] = this.transition
    this.backdrop.setOpacity(rectangle.coordsX.x2 / this.elementSize)
  }

  _threshold(state, stateObj) {
    const wasOpen = state[1] === 'open'
    if (wasOpen) {
      this.body.style.overflow = SCROLL
      this.backdrop.hide(this.options.TRANSITION)
    } else {
      this.body.style.overflow = HIDDEN
      this.backdrop.show(this.options.TRANSITION)
    }
    this.element.style[this.directionString] = stateObj.dimension
  }

  _belowThreshold(state, stateObj, rect) {
    const wasClosed = state[1] !== 'open'
    const overallEventTime = stateObj.TIMING

    if (overallEventTime / 1e3 < 0.7) {
      console.log(overallEventTime)
      const displacement = this.direction === BoundDrawer.UP || this.direction === BoundDrawer.DOWN ? rect.displacementY : rect.displacementX

      if(displacement > 0 && displacement >= 40 && rect.greaterWidth) {
        this.body.style.overflow = !wasClosed ? SCROLL : HIDDEN
        this.element.style[this.directionString] = stateObj.oppositeDimension
        this.backdrop.show(this.options.TRANSITION)
        console.log(`yeah ${rect.width}`)
      } else if (displacement < 0 && displacement <= -40 && rect.greaterWidth) {
        if (!wasClosed) {
          this.body.style.overflow = SCROLL
          this.backdrop.hide(this.options.TRANSITION)
        } else {
          this.body.style.overflow = HIDDEN
          this.backdrop.show(this.options.TRANSITION)
        }
        this.element.style[this.directionString] = stateObj.oppositeDimension
      }

    } else {
      if (wasClosed) {
        this.body.style.overflow = SCROLL
        this.backdrop.hide(this.options.TRANSITION)
      } else {
        this.body.style.overflow = HIDDEN
        this.backdrop.show(this.options.TRANSITION)
      }
      this.element.style[this.directionString] = stateObj.dimension
    }
  }
}

export default NavDrawer
