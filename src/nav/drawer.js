import {
  Bound,
  DIRECTIONS,
  NAVSTATE_EVENTS,
  NAV_BOX_SHADOW,
  css,
  getAttribute,
  getData
} from './../util'
import Drawer from './../drawer/'
import STATE from './state'

const ZERO = 0
const KILO = 1e3
const MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD = 0.5
const MIN_POSITIVE_DISPLACEMENT = 10
const MIN_NEGATIVE_DISPLACEMENT = -MIN_POSITIVE_DISPLACEMENT
const TRANSITION_STYLE = 'linear'
const EFFECT = 'transition'
const OVERFLOW = 'overflow'
const TRANS_TIMING = '0.1s'
const TRANS_TEMPLATE = `${TRANSITION_STYLE} ${TRANS_TIMING}`
const HIDDEN = 'hidden'
const SCROLL = 'scroll'
const AUTO = 'auto'
const HREF = 'href'
const HASH_ATTR = `data-${HREF}`
const START = 'start'
const MOVE = 'move'
const THRESHOLD = 'threshold'
const BELOW_THRESHOLD = `below${THRESHOLD}`
const MAX_TIME = KILO
const MAX_SPEED = 500

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
    this.element = this.options.ELEMENT
    this._body = this.options.BODY
    this._backdrop = this.options.BACKDROP
    this.direction = this.options.DIRECTION

    this._checkDirection()

    this.directionString = DIRECTIONS[this.direction]
    this.bound = this._bound

    const o = {
      ...options,
      SIZE: this.elementSize,
      TARGET: document
    }
    this.drawer = new Drawer.SnappedDrawer(o, this.bound)
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
    if (axis === Drawer.UP || axis === Drawer.DOWN) {
      return this.element.offsetHeight
    }
    return this.element.offsetWidth
  }

  /**
   * @returns {Bound} a boundary object: Bound
   */
  get _bound() {
    const curPos = css(this.element, this.directionString)
      .replace(/[^\d]*$/, '')
    const upperBound = this.elementSize
    const lowerBound = upperBound + parseInt(curPos, 10)
    return new Bound(lowerBound, upperBound)
  }

  _startHandler(response) {
    css(this.element, {
      [this.directionString]: response.dimension,
      boxShadow: NAV_BOX_SHADOW[this.directionString],
      [EFFECT]: this.transition
    })
    this._body.style.overflow = HIDDEN
  }

  _moveHandler(response, rectangle) {
    let curPos = this.direction === Drawer.UP || this.direction === Drawer.DOWN ? rectangle.coordsY.y2 : rectangle.coordsX.x2
    css(this.element, {
      [this.directionString]: response.dimension,
      [EFFECT]: 'none',
      [OVERFLOW]: HIDDEN
    })
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
      stateObj,
      transition: `${this.directionString} ease ${this._calcSpeed(stateObj.TIMING) / KILO}s`
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
      stateObj,
      transition: `${this.directionString} ease ${this._calcSpeed(stateObj.TIMING) / KILO}s`
    }
    let LOGIC
    if (this.direction === Drawer.LEFT && isClosed || this.direction === Drawer.RIGHT && !isClosed) {
      LOGIC =  displacement > ZERO && displacement >= MPD && rect.greaterWidth
    } else {
      LOGIC = displacement < ZERO && displacement <= MND && rect.greaterWidth
    }

    if (overallEventTime / KILO < MTTOB) {
      // DIRECTION: Drawer.UP | Drawer.LEFT
      if (LOGIC) {
        this._overrideBelowThresh(!isClosed, options)
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
    this._showPrep(options)
    this.element.style[this.directionString] = options.stateObj.dimension
  }

  _hide(options) {
    this._hidePrep(options)
    this.element.style[this.directionString] = options.stateObj.dimension
  }

  _overrideBelowThresh(isOpen, options) {
    if (isOpen) {
      this._hidePrep(options)
      this.element.style[this.directionString] = options.stateObj.oppositeDimension
    } else {
      this._showPrep(options)
      this.element.style[this.directionString] = options.stateObj.oppositeDimension
    }
  }

  _hidePrep(options) {
    this._body.style.overflow = SCROLL
    this._backdrop.hide(this.options.TRANSITION)
    css(this.element, {
      [EFFECT]: options.transition,
      [OVERFLOW]: AUTO
    })
    if (!this.bound.lower) {
      this.element.style.boxShadow = 'none'
    }
    this._setState('close')
    // callback for when nav is hidden
    if (STATE.event[NAVSTATE_EVENTS.hide]) {
      STATE.event[NAVSTATE_EVENTS.hide]()
    }
  }

  _showPrep(options) {
    const buttonHash = getAttribute(this.options.INIT_ELEM, HREF) || getData(this.options.INIT_ELEM, HASH_ATTR)
    if (buttonHash) {
      window.location.hash = buttonHash
    }
    this._body.style.overflow = HIDDEN
    this._backdrop.show(this.options.TRANSITION)
    css(this.element, {
      [EFFECT]: options.transition,
      [OVERFLOW]: AUTO
    })
    this._setState('open')
    // callback for when nav is shown
    if (STATE.event[NAVSTATE_EVENTS.show]) {
      STATE.event[NAVSTATE_EVENTS.show]()
    }
  }

  _calcSpeed(time) {
    if (time >= MAX_TIME) {
      return MAX_SPEED
    }
    const percent = 100
    const percentage = time / MAX_TIME * percent
    return percentage / percent * MAX_SPEED
  }

  _checkDirection() {
    if (this.direction !== Drawer.LEFT && this.direction !== Drawer.RIGHT) {
      throw new RangeError('Direction out of range')
    }
  }

  _setState(mode) {
    switch (mode) {
      case 'open':
        STATE.navstate = {
          alive: true,
          activity: {
            service: this,
            action: mode
          }
        }
        break
      case 'close':
        STATE.navstate = {
          alive: false,
          activity: {
            service: this,
            action: mode
          }
        }
        break
      default:
        throw new Error('this should never happen')
    }
  }
}

export default NavDrawer
