import Bottom from './bottom'
import Left from './left'
import Right from './right'
import Top from './top'
import {
  WINDOW
} from '../../util'

const BELOW_THRESHOLD = 'belowthreshold'
const THRESHOLD = 'threshold'
const START = 'start'
const MOVE = 'move'
const END = 'end'
const CLASS_TYPE = '[object SnappedDrawer]'

export default class SnappedDrawer {
  /**
   * @param {{}} options an object of configuration options
   * @param {Bound} bound a boundary object
   * @param {{}} drawerManager an object that helps manage drawers
   * especially when more than one drawer service is running
   */
  constructor(options, bound, drawerManager) {
    this._options = options
    this._drawerManager = drawerManager
    this._element = options.ELEMENT
    this._target = options.TARGET
    this._handlers = null
    this._direction = options.DIRECTION
    this._callibration = null
    this._callbacks = null
    this._context = this
    this._id = 0
    this.events = ['touchstart', 'touchmove', 'touchend']

    this._setCalibration(this._direction, bound)
  }

  // enum
  static UP = 0
  static LEFT = 1
  static DOWN = 2
  static RIGHT = 3

  // public
  /**
   * Make sure event handlers are registered using `Drawer.on(...)` before
   * calling `Drawer.activate()`
   *
   * @see {@link Drawer#on | Drawer.on}
   * @returns {void}
   */
  activate() {
    // get registered callbacks or set default
    const startfn = this._callbacks ? this._callbacks[START] : def
    const movefn = this._callbacks ? this._callbacks[MOVE] : def
    const endfn = this._callbacks ? this._callbacks[END] : def

    const startHandler = (touchEvent) => {
      const activity = this._drawerManager.getRunningActivity()
      if (this._callibration &&
        (this._id && activity && activity.id === this._id ||
          !activity && this._isCoolSignal(this._getSignal(touchEvent)))) {
        this._callibration.start(touchEvent, startfn)
      }
    }

    const moveHandler = (touchEvent) => {
      const activity = this._drawerManager.getRunningActivity()
      if (this._callibration && activity && activity.id === this._id) {
        this._callibration.move(touchEvent, movefn)
      }
    }

    const endHandler = (touchEvent) => {
      const activity = this._drawerManager.getRunningActivity()
      if (this._callibration && activity && activity.id === this._id) {
        const state = {}
        this._callibration.end(touchEvent, endfn, state) // state by Ref
        this._processThresholdState(state)
      }
    }

    this._register(startHandler, moveHandler, endHandler)
    for (let i = 0; i < this.events.length; i++) {
      this._target.addEventListener(this.events[i], this._handlers[i])
    }
  }

  /**
   * A method provided by the `Drawer interface` to deactivate the drawer
   * @returns {void}
   */
  deactivate() {
    for (let i = 0; i < this.events.length; i++) {
      this._target.removeEventListener(this.events[i], this._handlers[i])
    }
    this._register(null)
  }

  /**
   * A method used to register callbacks for the `Drawer class` `touchstart`,
   * `touchmove` and `touchend` event handlers.
   *
   * Always call `Drawer.on(...)` before `Drawer.activate()`.
   * As in:
   * ```js
   * const drawer = new Drawer()
   * drawer.on(event, () => {
   *  // TODO
   * }).activate()
   * ```
   *
   * To prevent modifying the context of `this`, the
   * `drawer.setContext(...)` method should be invoked with an
   * argument which is the `this` context of the
   * `calling class` or alternatively using a wrapper function,
   * then call the main handler method.
   * ```js
   * class UseDrawer {
   *  // CODE
   *  method() {
   *    const drawer = new Drawer()
   *    drawer.on(...)
   *      .setContext(this)
   *      .activate()
   *  }
   * }
   * // OR
   * drawer.on(event, (stateObj) => {
   *  this.handler.call(this, stateObj)
   * }).activate()
   * ```
   *
   * Valid event types taken by this method are:
   * - `start`
   * - `move`
   * - `end`
   * - `threshold`
   * - `belowthreshold`
   * @param {string} event The event type as in the above list
   * @param {Function} fn A function to call when this event triggers
   * @returns {this} Returns an instance variable of the `Drawer` class
   */
  on(event, fn) {
    this._registerCallbacks(event, fn)
    return this
  }

  setContext(ctx) {
    this._context = ctx
    this._callibration.setContext(ctx)
    return this
  }

  setServiceID(id) {
    if (typeof id !== 'number') {
      throw new TypeError('expected `id` to be a unique number')
    }
    this._id = id
  }

  toString() {
    return CLASS_TYPE
  }

  _processThresholdState(state) {
    if (Object.keys(state).length < 1) {
      return
    }
    const {
      state: stateArray,
      stateObj,
      service
    } = state
    const {
      rect
    } = stateObj
    this._callbacks[stateArray[0]].call(this._context, service, stateArray, stateObj, rect)
  }

  _setCalibration(point, bound) {
    switch (point) {
      case SnappedDrawer.UP:
        this._callibration = new Top(this._options, bound)
        break
      case SnappedDrawer.LEFT:
        this._callibration = new Left(this._options, bound)
        break
      case SnappedDrawer.DOWN:
        this._callibration = new Bottom(this._options, bound)
        break
      case SnappedDrawer.RIGHT:
        this._callibration = new Right(this._options, bound)
        break
      default:
        throw RangeError('Direction out of range')
    }
  }

  _isCoolSignal(signal) {
    const size = this._direction === SnappedDrawer.UP || this._direction === SnappedDrawer.DOWN ? WINDOW.screen.availHeight : WINDOW.screen.availWidth
    switch (this._direction) {
      case SnappedDrawer.UP:
      case SnappedDrawer.LEFT:
        return signal <= size / 2
      case SnappedDrawer.RIGHT:
      case SnappedDrawer.DOWN:
        return signal > size / 2
      default:
        return false
    }
  }

  _getSignal(emitter) {
    switch (this._direction) {
      case SnappedDrawer.UP:
      case SnappedDrawer.DOWN:
        return emitter.changedTouches[0].clientY
      case SnappedDrawer.LEFT:
      case SnappedDrawer.RIGHT:
        return emitter.changedTouches[0].clientX
      default:
        return null
    }
  }

  _registerCallbacks(event, fn) {
    this._callbacks = this._callbacks || {
      [START]: def,
      [MOVE]: def,
      [END]: def,
      [THRESHOLD]: def,
      [BELOW_THRESHOLD]: def
    }
    if (event in this._callbacks) {
      this._callbacks[event] = fn
    }
  }

  // private
  _register(...handlers) {
    this._handlers = handlers
  }
}

function def() {
  return false
}
