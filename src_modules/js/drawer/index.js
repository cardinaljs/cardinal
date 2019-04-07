import Bottom from './bottom'
import Left from './left'
import Right from './right'
import Top from './top'

const START = 'start'
const MOVE = 'move'
const END = 'end'
const THRESHOLD = 'threshold'
const BELOW_THRESHOLD = 'belowthreshold'

export default class Drawer {
  /**
   *
   * @param {{}} options - an object of configuration options
   */
  constructor(options) {
    this.options = options
    /**
     * @type {HTMLElement}
     */
    this.element = options.ELEMENT
    this.target = options.TARGET
    this.events = ['touchstart', 'touchmove', 'touchend']
    this.handlers = null
    this.direction = options.DIRECTION
    this.up = new Top(this.options)
    this.down = new Bottom(this.options)
    this.left = new Left(this.options)
    this.right = new Right(this.options)
    /**
     *
     * @type {{}}
     */
    this.callbacks = null
    this.context = null
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
   */
  activate() {
    // get registered callbacks or set default
    const startfn = this.callbacks ? this.callbacks[START] : () => {}
    const movefn = this.callbacks ? this.callbacks[MOVE] : () => {}
    const endfn = this.callbacks ? this.callbacks[END] : () => {}

    const startHandler = (e) => {
      if (this.direction === Drawer.UP) {
        this.up.start(e, startfn)
      } else if (this.direction === Drawer.DOWN) {
        this.down.start(e, startfn)
      } else if (this.direction === Drawer.LEFT) {
        this.left.start(e, startfn)
      } else if (this.direction === Drawer.DOWN) {
        this.right.start(e, startfn)
      } else {
        this.deactivate()
      }
    }

    let moveHandler = (e) => {
      if (this.direction === Drawer.UP) {
        this.up.move(e, movefn)
      } else if (this.direction === Drawer.DOWN) {
        this.down.move(e, movefn)
      } else if (this.direction === Drawer.LEFT) {
        this.left.move(e, movefn)
      } else if (this.direction === Drawer.DOWN) {
        this.right.move(e, movefn)
      } else {
        this.deactivate()
      }
    }

    let endHandler = (e) => {
      if (this.direction === Drawer.UP) {
        const state = {}
        this.up.end(e, endfn, state) // `state` is passed by Ref
        this._processThresholdState(state)
      } else if (this.direction === Drawer.DOWN) {
        const state = {}
        this.down.end(e, endfn, state)
        this._processThresholdState(state)
      } else if (this.direction === Drawer.LEFT) {
        const state = {}
        this.left.end(e, endfn, state)
        this._processThresholdState(state)
      } else if (this.direction === Drawer.DOWN) {
        const state = {}
        this.right.end(e, endfn, state)
        this._processThresholdState(state)
      } else {
        this.deactivate()
      }
    }

    this._register(startHandler, moveHandler, endHandler)
    for (let i = 0; i < this.events.length; i++) {
      this.target.addEventListener(this.events[i], this.handlers[i])
    }
  }

  /**
   * A method provided by the `Drawer interface` to deactivate the drawer
   */
  deactivate() {
    for (let i = 0; i < this.events; i++) {
      this.target.removeEventListener(this.events[i], this.handlers[i])
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
   * @param {string} event - The event type as in the above list
   * @param {Function} fn - A function to call when this event triggers
   * @returns `Drawer`
   */
  on(event, fn) {
    this._registerCallbacks(event, fn)
    return this
  }

  setContext(ctx) {
    this.context = ctx
    this.left.setContext(ctx)
    this.right.setContext(ctx)
    this.up.setContext(ctx)
    this.down.setContext(ctx)
    return this
  }

  _processThresholdState(state) {
    const thState = state.state[0]
    this.callbacks[thState].call(this.context || this, state.state, state.stateObj)
  }

  _registerCallbacks(event, fn) {
    const def = () => {}
    this.callbacks = this.callbacks || {
      [START]: def,
      [MOVE]: def,
      [END]: def,
      [THRESHOLD]: def,
      [BELOW_THRESHOLD]: def
    }
    if (event in this.callbacks) {
      this.callbacks[event] = fn
    } else {
      return // BugMan
    }
  }

  // private
  _register(...handlers) {
    this.handlers = [...handlers]
  }
}
