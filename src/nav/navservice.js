import {
  NAV_BOX_SHADOW,
  css
} from './../util'

const TRANSITION_STYLE = 'ease'
const EFFECT = 'transition'
const TRANS_END = 'transitionend'
const UNIT = 'px'

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
    this.transTime = options.TRANSITION / 1e3
    this.transition = `${this.direction} ${TRANSITION_STYLE} ${this.transTime}s`
    // state of the nav, whether open or close
    this.alive = false
    // diff. btw. event triggered from Drawer class and on here
    this._closeClicked = false
  }

  _width(unit) {
    unit = unit || ''
    return this.width + unit
  }

  activate() {
    this.button.addEventListener(this.event, (e) => {
      this.handler(e)
    })
    this.backdropElement.addEventListener(this.event, () => {
      this._close()
    })
    this.nav.addEventListener(TRANS_END, () => {
      if (!this.alive && this._closeClicked) {
        this._cleanShadow()
        this._closeClicked = false
      }
    })
    return 0
  }

  handler() {
    let state = NavService.css(this.nav, this.direction)
      .replace(/[^\d]*$/, '')
    state = /\.(?=\d)/.test(state) ? Math.floor(parseFloat(state)) : parseInt(state, 10)
    if (`${state}${UNIT}` === `-${this._width(UNIT)}`) {
      this._open()
    } else {
      this._close()
    }
  }

  _open() {
    const style = {
      [this.direction]: 0,
      [EFFECT]: this.transition,
      boxShadow: NAV_BOX_SHADOW
    }
    NavService.css(this.nav, style)
    this.backdrop.show(this.options.TRANSITION)
    this.alive = true
  }

  _close() {
    const style = {
      [this.direction]: `-${this._width(UNIT)}`,
      [EFFECT]: this.transition
      // don't clean shadow here
      // it's transitioning
    }
    NavService.css(this.nav, style)
    this.backdrop.hide(this.options.TRANSITION)
    this.alive = false
    this._closeClicked = true
  }

  _cleanShadow() {
    NavService.css(this.nav, 'boxShadow', 'none')
  }

  static css(el, property, style) {
    return css(el, property, style)
  }

  deactivate() {
    throw ReferenceError('cannot deactivate API specified as default. This service must be kept running')
  }
}

export default NavService
