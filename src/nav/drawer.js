import {
  DIRECTIONS,
  NAV_BOX_SHADOW
} from './../util'
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
const MOVE = 'move'
const THRESHOLD = 'threshold'
const BELOW_THRESHOLD = `below${THRESHOLD}`

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
    this._body = this.options.BODY
    this._backdrop = this.options.BACKDROP
    /**
     * @type {number}
     */
    this.direction = this.options.DIRECTION

    this.checkDirection()

    this.directionString = DIRECTIONS[this.direction]

    const o = {
      ...options,
      SIZE: this.elementSize,
      TARGET: document
    }
    this.drawer = new Drawer.SnappedDrawer(o)
    this.transition = `${this.directionString} ${TRANS_TEMPLATE}`
  }

  checkDirection() {
    if (this.direction !== Drawer.LEFT && this.direction !== Drawer.RIGHT) {
      throw RangeError('Direction out of range')
    }
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
    if (axis === Drawer.UP || axis === Drawer.DOWN) {
      return this.element.offsetHeight
    }
    return this.element.offsetWidth
  }

  _startHandler(response) {
    this.element.style[this.directionString] = response.displacement
    this.element.style.boxShadow = NAV_BOX_SHADOW
    this.element.style[EFFECT] = this.transition
    this._body.style.overflow = HIDDEN
  }

  _moveHandler(response, rectangle) {
    let curPos = this.direction === Drawer.UP || this.direction === Drawer.DOWN ? rectangle.coordsY.y2 : rectangle.coordsX.x2
    this.element.style[this.directionString] = response.dimension
    this.element.style[EFFECT] = this.transition
    if (this.direction === Drawer.RIGHT) {
      const WIN_SIZE = window.screen.availWidth
      curPos = WIN_SIZE - curPos
      this._backdrop.setOpacity(curPos / this.elementSize)
      return
    }
    this._backdrop.setOpacity(curPos / this.elementSize)
  }

  _threshold(state, stateObj) {
    const isOpen = state[1] === 'open'
    const options = {
      stateObj
    }
    if (isOpen) {
      this._hide(options)
    } else {
      this._show(options)
    }
  }

  _belowThreshold(state, stateObj, rect) {
    const isClosed = state[1] !== 'open'
    const overallEventTime = stateObj.TIMING
    const MTTOB = MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD
    const MPD = MIN_POSITIVE_DISPLACEMENT
    const MND = MIN_NEGATIVE_DISPLACEMENT
    const displacement = this.direction === Drawer.UP || this.direction === Drawer.DOWN
      ? rect.displacementY : rect.displacementX
    const options = {
      stateObj
    }
    const LOGIC = this.direction === Drawer.LEFT
      ? displacement > ZERO && displacement >= MPD && rect.greaterWidth
      : displacement < ZERO && displacement <= MND && rect.greaterWidth

    if (overallEventTime / KILO < MTTOB) {
      // DIRECTION: Drawer.UP | Drawer.LEFT
      if (LOGIC) {
        this.__overrideBelowThresh(!isClosed, options)
      } else {
        if (isClosed) {
          // close it back didn't hit thresh. and can't override
          this._hide(options)
          return
        }
        // open it back didn't hit thresh. and can't override because not enough displacement
        this._show(options)
      }
    } else {
      if (isClosed) {
        // close it back didn't hit thresh. and can't override because not enough velocity or displacement
        this._hide(options)
        return
      }
      // open it back didn't hit thresh. and can't override because not enough velocity or displacement
      this._show(options)
    }
  }

  _show(options) {
    this._body.style.overflow = HIDDEN
    this._backdrop.show(this.options.TRANSITION)
    this.element.style[this.directionString] = options.stateObj.dimension
  }

  _hide(options) {
    this._body.style.overflow = SCROLL
    this._backdrop.hide(this.options.TRANSITION)
    this.element.style[this.directionString] = options.stateObj.dimension
    this.element.style.boxShadow = 'none'
  }

  __overrideBelowThresh(isOpen, options) {
    if (isOpen) {
      this._body.style.overflow = SCROLL
      this._backdrop.hide(this.options.TRANSITION)
      this.element.style[this.directionString] = options.stateObj.oppositeDimension
      this.element.style.boxShadow = 'none'
    } else {
      this._body.style.overflow = HIDDEN
      this._backdrop.show(this.options.TRANSITION)
      this.element.style[this.directionString] = options.stateObj.oppositeDimension
    }
  }
}

export default NavDrawer
