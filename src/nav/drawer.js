import {
  Bound,
  DIRECTIONS,
  NAVSTATE_EVENTS,
  NAV_BOX_SHADOW,
  WINDOW,
  css,
  getAttribute,
  getData
} from './../util'
import Drawer from './../drawer/'

const ZERO = 0
const KILO = 1e3
const MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD = 0.5
const MIN_POSITIVE_DISPLACEMENT = 10
const MIN_NEGATIVE_DISPLACEMENT = -MIN_POSITIVE_DISPLACEMENT
const TRANSITION_STYLE = 'linear'// 'cubic-bezier(0, 0.5, 0, 1)'
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
const MIN_SPEED = 100
const MAX_SPEED = 500

class NavDrawer {
  /**
   * Creates a new NavDrawer object. Providing the Left and Right
   * Drawer functionality.
   * Support for Top and Bottom may come in the future
   * @throws RangeError
   * @param {{}} options An options Object to configure the Drawer with
   * @param {{}} state An activity and service manager
   */
  constructor(options, state) {
    this.options = options
    this.state = state
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
    this.drawer = new Drawer.SnappedDrawer(o, this.bound, Drawer.DrawerManagementStore)
    Drawer.DrawerManagementStore.pushActivity(this.state.activity)
    this.transition = `${this.directionString} ${TRANS_TEMPLATE}`
  }

  activate() {
    this.drawer.on(START, this._startHandler)
      .on(MOVE, this._moveHandler)
      .on(THRESHOLD, this._threshold)
      .on(BELOW_THRESHOLD, this._belowThreshold)
      .setContext(this)
      .activate()
    this.drawer.setServiceID(this.state.activity.id)
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
    const upperBound = this.elementSize
    if (this.direction === Drawer.RIGHT) {
      const lowerBound = WINDOW.screen.width - this.element.offsetLeft
      return new Bound(lowerBound, upperBound)
    }
    const lowerBound = upperBound + this.element.offsetLeft
    return new Bound(lowerBound, upperBound)
  }

  _startHandler(service, response) {
    service.lock()
    this.state.activity.run()
    css(this.element, {
      [this.directionString]: response.dimension,
      boxShadow: NAV_BOX_SHADOW[this.directionString],
      [EFFECT]: this.transition
    })
    this._body.style.overflow = HIDDEN
  }

  _moveHandler(service, response, rectangle) {
    service.lock()
    let curPos = this.direction === Drawer.UP || this.direction === Drawer.DOWN ? rectangle.coordsY.y2 : rectangle.coordsX.x2
    css(this.element, {
      [this.directionString]: response.dimension,
      [EFFECT]: 'none',
      [OVERFLOW]: HIDDEN
    })
    if (this.direction === Drawer.RIGHT) {
      const WIN_SIZE = WINDOW.screen.width
      curPos = WIN_SIZE - curPos
      this._backdrop.setOpacity(curPos / this.elementSize)
      return
    }
    this._backdrop.setOpacity(curPos / this.elementSize)
  }

  _threshold(service, state, stateObj, rect) {
    service.lock()
    const isOpen = state[1] === 'open'
    const options = {
      stateObj,
      transition: `${this.directionString} ${TRANSITION_STYLE} ${this._calcSpeed(stateObj.TIMING, rect.width) / KILO}s`
    }
    if (isOpen) {
      this._hide(options)
    } else {
      this._show(options)
    }
  }

  _belowThreshold(service, state, stateObj, rect) {
    service.lock()
    const isClosed = state[1] !== 'open'
    const overallEventTime = stateObj.TIMING
    const MTTOB = MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD
    const MPD = MIN_POSITIVE_DISPLACEMENT
    const MND = MIN_NEGATIVE_DISPLACEMENT
    const displacement = this.direction === Drawer.UP || this.direction === Drawer.DOWN
      ? rect.displacementY : rect.displacementX
    const options = {
      stateObj,
      transition: `${this.directionString} ${TRANSITION_STYLE} ${this._calcSpeed(stateObj.TIMING, rect.width) / KILO}s`
    }
    let LOGIC
    if (this.direction === Drawer.LEFT && isClosed || this.direction === Drawer.RIGHT && !isClosed) {
      LOGIC =  displacement > ZERO && displacement >= MPD && rect.greaterWidth
    } else {
      LOGIC = displacement < ZERO && displacement <= MND && rect.greaterWidth
    }

    if (overallEventTime / KILO < MTTOB) {
      if (LOGIC) {
        this._overrideBelowThresh(!isClosed, options)
      } else {
        if (isClosed) {
          // Close it. Can't override
          this._hide(options)
          return
        }
        // Open it. Can't override. Not enough displacement
        this._show(options)
      }
    } else {
      if (isClosed) {
        // close it
        this._hide(options)
        return
      }
      // open it
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
    this.state.activity.derun()
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
    if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.hide)) {
      this.state.getStateEventHandler(NAVSTATE_EVENTS.hide)()
    }
  }

  _showPrep(options) {
    const buttonHash = getAttribute(this.options.INIT_ELEM, HREF) || getData(this.options.INIT_ELEM, HASH_ATTR)
    if (buttonHash) {
      WINDOW.location.hash = buttonHash
    }
    this._body.style.overflow = HIDDEN
    this._backdrop.show(this.options.TRANSITION)
    css(this.element, {
      [EFFECT]: options.transition,
      [OVERFLOW]: AUTO
    })
    this._setState('open')
    // callback for when nav is shown
    if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.show)) {
      this.state.getStateEventHandler(NAVSTATE_EVENTS.show)()
    }
  }

  _calcSpeed(time, distance) {
    const distanceRemain = this.elementSize - distance
    if (~Math.sign(distanceRemain)) {
      let newTime = distanceRemain * time / distance
      if (newTime > MAX_SPEED) {
        newTime = MAX_SPEED
      } else if (newTime < MIN_SPEED) {
        newTime = MIN_SPEED
      }
      return newTime
    }
    return 0
  }

  _checkDirection() {
    if (this.direction !== Drawer.LEFT && this.direction !== Drawer.RIGHT) {
      throw new RangeError('Direction out of range')
    }
  }

  _setState(mode) {
    switch (mode) {
      case 'open':
        this.state.activity.run()
        break
      case 'close':
        this.state.activity.derun()
        break
      default:
        throw new Error('this should never happen')
    }
  }
}

export default NavDrawer
