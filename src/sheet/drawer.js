import {
  Bound,
  DIRECTIONS,
  NAVSTATE_EVENTS,
  NAV_BOX_SHADOW,
  WINDOW,
  css,
  getAttribute,
  getData,
  resolveThreshold
} from './../util'
import Drawer from './../drawer/'

const ZERO = 0
const KILO = 1e3
const MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD = 0.1
const MIN_POSITIVE_DISPLACEMENT = 15
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
const MarkIndex = {
  high: 'high',
  mid: 'mid',
  low: 'low'
}

class SheetDrawer {
  /**
   * Creates a new SheetDrawer object. Providing the Top and Bottom
   * Drawer functionality
   * @throws RangeError
   * @param {{}} options An options Object to configure the Drawer with
   * @param {State} state An activity and service manager
   */
  constructor(options, state) {
    this.options = options
    this.state = state
    this.element = this.options.ELEMENT
    this._body = this.options.BODY
    this.backdrop = this.options.BACKDROP
    this.direction = this.options.DIRECTION

    this._checkDirection()

    this.directionString = DIRECTIONS[this.direction]
    this.bound = this._bound
    this._oldbound = null

    const o = {
      ...options,
      SIZE: this.elementSize,
      TARGET: document
    }
    this.drawer = new Drawer.SnappedDrawer(o, this.bound, Drawer.DrawerManagementStore)
    Drawer.DrawerManagementStore.pushActivity(this.state.activity)
    this.transition = `${this.directionString} ${TRANS_TEMPLATE}`
    this.marks = {
      [MarkIndex.high]: ZERO,
      [MarkIndex.mid]: this.bound.slack * resolveThreshold(options.threshold),
      [MarkIndex.low]: this.bound.slack
    }
    this._Control = {
      touchMoveExited: false,
      lastMetredPos: -1
    }
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
    return this.element.offsetHeight
  }

  get _bound() {
    const upperBound = this.elementSize
    if (this.direction === Drawer.DOWN) {
      // get `element.offsetBottom`
      const lowerBound = WINDOW.screen.availHeight - this.element.offsetTop
      return new Bound(lowerBound, upperBound)
    }
    const lowerBound = upperBound + this.element.offsetTop
    return new Bound(lowerBound, upperBound)
  }

  _startHandler(service, response) {
    service.lock()
    this.state.activity.run()
    css(this.element, {
      [this.directionString]: !this.bound.lower ? response.dimension : null,
      boxShadow: NAV_BOX_SHADOW[this.directionString],
      [EFFECT]: this.transition
    })
    this._body.style.overflow = HIDDEN
  }

  _moveHandler(service, response, rectangle) {
    service.lock()
    const WIN_SIZE = WINDOW.screen.availHeight
    let curPos = rectangle.coordsY.y2
    if (response.posOnStart === this.marks[MarkIndex.high] && this.element.scrollTop !== ZERO) {
      this._Control.touchMoveExited = true
      this._Control.lastMetredPos = curPos
      return
    }
    this._Control.touchMoveExited = false
    const customDimension = this.direction === Drawer.DOWN ? this._Control.lastMetredPos - curPos + response.posOnStart : -this._Control.lastMetredPos + curPos + response.posOnStart
    css(this.element, {
      [this.directionString]: response.dimension,
      [EFFECT]: 'none',
      [OVERFLOW]: HIDDEN
    })
    if (response.posOnStart === this.marks[MarkIndex.high] && response.closing) {
      css(this.element, this.directionString, SheetDrawer._toUnit(customDimension, this.options.unit))
    }
    if (response.posOnStart === Math.round(this.marks[MarkIndex.mid]) && response.opening) {
      css(this.element, OVERFLOW, SCROLL)
    }
    if (this.direction === Drawer.DOWN) {
      curPos = WIN_SIZE - curPos
    }
    this.backdrop.setOpacity(curPos / this.elementSize)
  }

  _threshold(service, state, stateObj) {
    service.lock()
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

  _belowThreshold(service, state, stateObj, rect) {
    service.lock()
    const isClosed = state[1] !== 'open'
    const overallEventTime = stateObj.TIMING
    const MTTOB = MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD
    const MPD = MIN_POSITIVE_DISPLACEMENT
    const MND = MIN_NEGATIVE_DISPLACEMENT
    const displacement = rect.displacementY
    const options = {
      stateObj,
      transition: `${this.directionString} ease ${this._calcSpeed(stateObj.TIMING) / KILO}s`
    }
    const {
      position
    } = options.stateObj
    const minForwardVelocity = MPD / MTTOB // pixel/second: pps
    const minBackwardVelocity = MND / MTTOB // pps
    const velocity = displacement / (overallEventTime / KILO)
    const LOGIC = this.direction === Drawer.UP && isClosed ||
    this.direction === Drawer.DOWN && !isClosed
      ? velocity > minForwardVelocity && rect.greaterHeight
      : velocity < minBackwardVelocity && rect.greaterHeight

    if (LOGIC) {
      this._overrideBelowThresh(!isClosed, options)
      return
    }
    if (isClosed) {
      this._hidePrep(options)
      this.element.style[this.directionString] = SheetDrawer._toUnit(
        position >= this.marks[MarkIndex.mid] ? this.marks[MarkIndex.mid] : this.marks[MarkIndex.low],
        this.options.unit
      )
    } else {
      this._showPrep(options)
      this.element.style[this.directionString] = SheetDrawer._toUnit(
        position >= this.marks[MarkIndex.mid] ? this.marks[MarkIndex.mid] : this.marks[MarkIndex.high],
        this.options.unit
      )
    }
  }

  _show(options) {
    if (this._Control.touchMoveExited) {
      this._Control.touchMoveExited = false
      return
    }
    this._showPrep(options)
    this.element.style[this.directionString] = SheetDrawer._toUnit(this.marks[MarkIndex.high], this.options.unit)
  }

  _hide(options) {
    if (this._Control.touchMoveExited) {
      this._Control.touchMoveExited = false
      return
    }
    this._hidePrep(options)
    this.element.style[this.directionString] = SheetDrawer._toUnit(this.marks[MarkIndex.low], this.options.unit)
  }

  _overrideBelowThresh(isOpen, options) {
    const {
      oppositeDimension,
      position
    } = options.stateObj
    const isDownDrawer = this.direction === Drawer.DOWN
    if (isOpen) {
      if (this._Control.touchMoveExited) {
        this._Control.touchMoveExited = false
        return
      }
      this.element.style[this.directionString] = SheetDrawer._toUnit(
        position >= this.marks[MarkIndex.mid] ? this.marks[MarkIndex.mid] : this.marks[MarkIndex.low],
        this.options.unit
      )
      this._halfHidePrep(options)
    } else {
      const halfDimension = SheetDrawer._toUnit(this.marks[MarkIndex.mid], this.options.unit)
      this._showPrep(options)
      this.element.style[this.directionString] = isDownDrawer ? halfDimension : oppositeDimension
    }
  }

  _halfHidePrep(options) {
    this._body.style.overflow = HIDDEN
    css(this.element, {
      [EFFECT]: options.transition,
      [OVERFLOW]: AUTO
    })
  }

  _hidePrep(options) {
    this._body.style.overflow = SCROLL
    this.backdrop.hide(this.options.TRANSITION)
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
    this._body.style.overflow = options.bodyOverflow || HIDDEN
    this.backdrop.show(this.options.TRANSITION)
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

  _calcSpeed(time) {
    if (time >= MAX_TIME) {
      return MAX_SPEED
    }
    const percent = 100
    const percentage = time / MAX_TIME * percent
    return percentage / percent * MAX_SPEED
  }

  _checkDirection() {
    if (this.direction !== Drawer.UP && this.direction !== Drawer.DOWN) {
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

  _updateBound() {
    const bound = this._bound
    this._oldbound = new Bound(this.bound.lower, this.bound.upper)
    this.bound.lower = bound.lower
  }

  static _toUnit(value, unit = 'px') {
    return value + unit
  }
}

export default SheetDrawer
