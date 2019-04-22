import Bottom from './bottom'
import Left from './left'
import Right from './right'
import Top from './top'

const BELOW_THRESHOLD = 'belowthreshold'
const THRESHOLD = 'threshold'
const START = 'start'
const MOVE = 'move'
const END = 'end'

export default class SnappedDrawer {
  /**
   *
   * @param {{}} options an object of configuration options
   */
  constructor(options) {
    this._options = options
    /**
     * @type {HTMLElement}
     */
    this._element = options.ELEMENT
    this._target = options.TARGET
    this.events = ['touchstart', 'touchmove', 'touchend']
    this._handlers = null
    this._direction = options.DIRECTION
    this._callibration = null
    /**
     * @type {{}}
     */
    this._callbacks = null
    this._context = null

    this._setCalibration(this._direction)
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

    const startHandler = (e) => {
      if (this._direction !== null) {
        this._callibration.start(e, startfn)
      } else {
        this.deactivate()
      }
    }

    const moveHandler = (e) => {
      if (this._direction !== null) {
        this._callibration.move(e, movefn)
      } else {
        this.deactivate()
      }
    }

    const endHandler = (e) => {
      if (this._direction !== null) {
        const state = {}
        this._callibration.end(e, endfn, state) // state by Ref
        this._processThresholdState(state)
      } else {
        this.deactivate()
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
    for (let i = 0; i < this.events; i++) {
      this._target.removeEventListener(this.events[i], this._handlers[i])
    }
    this._register()
  }

  /**
   * A function used to register callbacks for the `Drawer class` `touchstart`,
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

  _processThresholdState(state) {
    if (Object.keys(state).length < 1) {
      return
    }
    const thState = state.state[0]
    const vector = state.stateObj.rect
    delete state.stateObj.rect
    this._callbacks[thState].call(this._context || this, state.state, state.stateObj, vector)
  }

  _setCalibration(point) {
    switch (point) {
      case SnappedDrawer.UP:
        this._callibration = new Top(this._options)
        break
      case SnappedDrawer.LEFT:
        this._callibration = new Left(this._options)
        break
      case SnappedDrawer.DOWN:
        this._callibration = new Bottom(this._options)
        break
      case SnappedDrawer.RIGHT:
        this._callibration = new Right(this._options)
        break
      default:
        throw RangeError('Direction out of range')
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
    this._handlers = [...handlers]
  }
}

function def() {
  return false
}
