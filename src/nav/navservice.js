import {
  NAV_BOX_SHADOW,
  ZERO,
  css,
  getAttribute
} from './../util'
import STATE from './state'

const TRANSITION_STYLE = 'ease'
const EFFECT = 'transition'
const TRANS_END = 'transitionend'

class NavService {
  constructor(options) {
    this.options = options
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
    this._closeClicked = false
    /**
     * @readonly
     * @private
     */
    this._initialState = NavService.css(this.nav, this.direction)
    this._handlers = null
  }

  activate() {
    const ClickHandler = (e) => {
      this.handler(e)
    }
    const BackdropHandler = () => {
      this._close()
    }
    const TransitionHandler = () => {
      if (!this.alive && this._closeClicked) {
        this._cleanShadow()
        this._closeClicked = false
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
    throw new ReferenceError('cannot deactivate API specified as default. This service must be kept running')
  }

  forceDeactivate() {
    this.button.removeEventListener(this.event, this._handlers.ClickHandler)
    this.backdropElement.removeEventListener(this.event, this._handlers.BackdropHandler)
    if (this._initialState === `-${this._width('px')}`) {
      this.nav.removeEventListener(TRANS_END, this._handlers.TransitionHandler)
    }
    this._register(null)
  }

  handler(e) {
    e.preventDefault()
    window.location.hash = getAttribute(this.button, 'href')
    const state = NavService._toNum(NavService.css(this.nav, this.direction))
    if (state < ZERO) {
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
    this.alive = true
    const state = {
      alive: this.alive,
      activity: {
        service: this,
        action: 'open'
      }
    }
    STATE.navstate = state
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
    this.alive = false
    this._closeClicked = true
    const state = {
      alive: this.alive,
      activity: {
        service: this,
        action: 'close'
      }
    }
    STATE.navstate = state
  }

  _cleanShadow() {
    NavService.css(this.nav, 'boxShadow', 'none')
  }
}

export default NavService
