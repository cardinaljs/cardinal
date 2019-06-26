import {
  NAVSTATE_EVENTS,
  NAV_BOX_SHADOW,
  WINDOW,
  ZERO,
  css,
  getAttribute,
  getData
} from './../util'

const TRANSITION_STYLE = 'ease'
const EFFECT = 'transition'
const TRANS_END = 'transitionend'

class NavService {
  constructor(options, state) {
    this.options = options
    this.state = state
    this.nav = options.ELEMENT
    this.button = options.INIT_ELEM
    this.backdrop = options.BACKDROP
    this.backdropElement = this.backdrop.backdrop
    this.event = 'click'
    this.direction = options.DIRECTION
    this.width = this.nav.offsetWidth
    this.transTime = options.TRANSITION / 1e3
    this.transition = `${this.direction} ${TRANSITION_STYLE} ${this.transTime}s`
    // state of the nav, whether open or close
    this.alive = false
    // diff. btw. event triggered from Drawer class and on here
    /**
     * @private
     */
    this._closeInvoked = false
    /**
     * @readonly
     * @private
     */
    this._initialState = NavService.css(this.nav, this.direction)
    this._handlers = null
  }

  activate() {
    const ClickHandler = (mouseEvent) => {
      this.handler(mouseEvent)
    }
    const BackdropHandler = () => {
      this._close()
    }
    const TransitionHandler = () => {
      if (!this.alive && this._closeInvoked) {
        this._cleanShadow()
        this._closeInvoked = false
      }
    }
    this._register({
      ClickHandler,
      BackdropHandler,
      TransitionHandler
    })

    this.button.addEventListener(this.event, this._handlers.ClickHandler)
    this.backdropElement.addEventListener(this.event, this._handlers.BackdropHandler)
    if (this._initialState === `-${this._width('px')}`) {
      this.nav.addEventListener(TRANS_END, this._handlers.TransitionHandler)
    }
    return 0
  }

  deactivate() {
    throw new ReferenceError('cannot deactivate a default service. This service must be kept running')
  }

  forceDeactivate() {
    this.button.removeEventListener(this.event, this._handlers.ClickHandler)
    this.backdropElement.removeEventListener(this.event, this._handlers.BackdropHandler)
    if (this._initialState === `-${this._width('px')}`) {
      this.nav.removeEventListener(TRANS_END, this._handlers.TransitionHandler)
    }
    this._register(null)
  }

  handler(mouseEvent) {
    mouseEvent.preventDefault()
    const state = NavService._toNum(NavService.css(this.nav, this.direction))
    if (state < ZERO) {
      const buttonHash = getAttribute(this.button, 'href') || getData(this.button, 'data-href')
      if (buttonHash) {
        WINDOW.location.hash = buttonHash
      }
      this._open()
    } else {
      this._close()
    }
  }

  static css(el, property, style) {
    return css(el, property, style)
  }

  static _toNum(val) {
    val = val.replace(/[^\d]*$/, '')
    return /\.(?=\d)/.test(val) ? Math.round(parseFloat(val)) : parseInt(val, 10)
  }

  _width(unit) {
    unit = unit || ''
    return this.width + unit
  }

  _register(handler) {
    this._handlers = handler
  }

  _open() {
    const style = {
      [this.direction]: ZERO,
      [EFFECT]: this.transition,
      boxShadow: NAV_BOX_SHADOW[this.direction]
    }
    NavService.css(this.nav, style)
    this.backdrop.show(this.options.TRANSITION)
    // callback for when nav is shown
    if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.show)) {
      this.state.getStateEventHandler(NAVSTATE_EVENTS.show)()
    }
    this.alive = true
    this.state.activity.run()
  }

  _close() {
    const style = {
      [this.direction]: this._initialState,
      [EFFECT]: this.transition
      // don't clean shadow here
      // it's transitioning
    }
    NavService.css(this.nav, style)
    this.backdrop.hide(this.options.TRANSITION)
    // callback for when nav is hidden
    if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.hide)) {
      this.state.getStateEventHandler(NAVSTATE_EVENTS.hide)()
    }
    this.alive = false
    this._closeInvoked = true
    this.state.activity.derun()
  }

  _cleanShadow() {
    NavService.css(this.nav, 'boxShadow', 'none')
  }
}

export default NavService
