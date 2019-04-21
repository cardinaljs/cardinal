import { css } from './../util'

const TRANSITION_STYLE = "ease"
const EFFECT = "transition"
const HASH = "menu"
const UNIT = "px"

class NavService {
  constructor(options) {
    this.options = options
    this.nav = options.ELEMENT
    this.button = options.INIT_ELEM
    this.backdrop = options.BACKDROP
    this.backdropElement = this.backdrop.backdrop
    this.event = options.DEFAULT_EVENT || 'click'
    this.direction = options.DIRECTION
    this.width = this.nav.offsetWidth
    this.trans_time = options.TRANSITION/1e3
    this.transition = `${this.direction} ${TRANSITION_STYLE} ${this.trans_time}s`
    // state of the nav, whether open or close
    this.alive = false
  }

  _width(unit) {
    unit = unit || ""
    return this.width + unit
  }

  activate() {
    this.button.addEventListener(this.event, (e) => {
      this.handler.call(this, e)
    })
    this.backdropElement.addEventListener(this.event, (e) => {
      this.handler.call(this, e)
    })
    return 0
  }

  handler() {
    let state = NavService.css(this.nav, this.direction).
      replace(/[^\d]*$/, '')
    state = /\.(?=\d)/.test(state) ? Math.floor(parseFloat(state)) : parseInt(state)
    if (`${state}${UNIT}` == `-${this._width(UNIT)}`) {
      this._open()
    } else {
      this._close()
    }
  }

  _open() {
    let style = {
      [this.direction]: 0,
      [EFFECT]: this.transition
    }
    NavService.css(this.nav, style)
    this.backdrop.show(this.options.TRANSITION)
    this.alive = true
  }

  _close() {
    let style = {
      [this.direction]: `-${this._width(UNIT)}`,
      [EFFECT]: this.transition
    }
    NavService.css(this.nav, style)
    this.backdrop.hide(this.options.TRANSITION)
    this.alive = false
  }

  static css(el, property, style) {
    return css(el, property, style)
  }

  deactivate() {
    this.button.removeEventListener(this.event, this.handler)
    return 0
  }
}

export default NavService
