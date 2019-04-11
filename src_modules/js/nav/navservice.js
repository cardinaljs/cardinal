
const OPACITY = "opacity"
const DISPLAY = "display"
const LEFT = "left"
const RIGHT = "right"
const TRANSITION_STYLE = "ease"
const TRANSITION_TIMING = "0.6s"
const EFFECT = "transition"
const HASH = "menu"
const BACK = "back"
const FORTH = "forth"
const UNIT = "px"
const TSTT = `${TRANSITION_STYLE} ${TRANSITION_TIMING}`
const BACKDROP_TRANS = `background ${TSTT},
${DISPLAY} ${TSTT}`
const BACKDROP_BGA = "rgba(0,0,0,.4)"
const BACKDROP_BGI = "rgba(0,0,0,0)"

class NavService {
  constructor(options) {
    this.options = options
    this.nav = options.ELEMENT
    this.button = options.INIT_ELEM
    this.backdrop = options.BACKDROP
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
    return 0
  }

  handler() {
    console.log('clicked')
    NavService.backdrop_color = this.backdrop.style.background || this.backdrop.style.backgroundColor || BACKDROP_BGA
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
    let bdStyle = {
      background: NavService.backdrop_color,
      [EFFECT]: BACKDROP_TRANS,
      [DISPLAY]: "BLOCK"
    }
    NavService.css(this.backdrop, bdStyle)
    this.alive = true
  }

  _close() {
    let style = {
      [this.direction]: `-${this._width(UNIT)}`,
      [EFFECT]: this.transition
    }
    NavService.css(this.nav, style)
    let bdStyle = {
      background: BACKDROP_BGI,
      [EFFECT]: BACKDROP_TRANS,
      [DISPLAY]: "NONE"
    }
    NavService.css(this.backdrop, bdStyle)
    this.alive = false
  }

  static css(el, property, style) {
    return _css(el, property, style)
  }

  deactivate() {
    this.button.removeEventListener(this.event, this.handler)
    return 0
  }
}

export function _css(el, property, style) {
  const STYLEMAP = window.getComputedStyle(el)
  /**
   * @param property?: string
   * @param style: string|Array|Object
   * @return void
   *     if called as a setter
   *
   */
  style = style || null
  property = property || null

  if (typeof property === "string" && style !== null) {
    // setting one property
    el.style[property] = style
    return
  }
  if (typeof property === "object" && property instanceof Object) {
    // `style` MUST = null
    // setting many properties
    style = property
    for (let prop of Object.keys(style)) {
      el.style[prop] = style[prop]
    }
  } else if (property instanceof Array) {
    // return all values of properties in the array for
    // the element as object
    let ostyle = {}
    style = STYLEMAP
    for (let prop of style) {
      ostyle[prop] = style[prop]
    }
    return ostyle
  } else {
    // get style from property
    return STYLEMAP[property]
  }
  return void(0)
}

export default NavService
