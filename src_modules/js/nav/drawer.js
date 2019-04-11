import BoundDrawer from './../drawer/'

const TRANSITION_STYLE = 'linear'
const EFFECT = 'transition'
const TRANS_TIMING = '0.1s' // This value is basic, the calc'ed value will depend on drawer speed
const OPACITY = 'opacity'
const TRANS_TEMPLATE = `${TRANSITION_STYLE} ${TRANS_TIMING}`
const HIDDEN = 'hidden'
const SCROLL = 'scroll'
const START = 'start'
const MOVE = 'move'
const END = 'end'
const THRESHOLD = 'threshold'
const BELOW_THRESHOLD = `below${THRESHOLD}`
const DIRECTIONS = ['top', 'left', 'bottom', 'right']

class NavDrawer {
  /**
   *
   * @param {{}} options An options Object to configure the Drawer with
   */
  constructor(options) {
    this.options = options
    /**
     * @type {HTMLElement}
     */
    this.element = this.options.ELEMENT
    /**
     * @type {HTMLElement}
     */
    this.body = this.options.BODY
    /**
     * @type {HTMLElement}
     */
    this.backdrop = this.options.BACKDROP
    /**
     * @type {string}
     */
    this.direction = this.options.DIRECTION
    this.directionString = DIRECTIONS[this.direction]
    this.handlers = []
    this.events = [
      this.options.touchstart,
      this.options.touchmove,
      this.options.touchend
    ]

    let o = {
      ...options,
      TARGET: document
    }
    this.drawer = new BoundDrawer(o)
    this.transition = `${this.directionString} ${TRANS_TEMPLATE}`
    this.backdropTransition = `${OPACITY} ${TRANS_TEMPLATE}`
  }

  activate() {
    this.drawer.on(START, this._startHandler)
      .on(MOVE, this._moveHandler)
      .on(THRESHOLD, this._threshold)
      .on(BELOW_THRESHOLD, this._belowThreshold)
      .setContext(this)
      .activate()
    return 0
  }

  deactivate() {
    this.drawer.deactivate()
    return 0
  }

  _startHandler(response, rectangle) {
    this.element.style[this.directionString] = response.displacement
    this.element.style[EFFECT] = this.transition
    this.body.style.overflow = HIDDEN
  }

  _moveHandler(response, rectangle) {
    this.element.style[this.directionString] = response.dimension
    this.element.style[EFFECT] = this.transition
  }

  _threshold(state, stateObj) {
    const isOpen = state[1] === 'open'
    this.body.style.overflow = isOpen ? SCROLL : HIDDEN
    this.element.style[this.directionString] = stateObj.dimension
  }

  _belowThreshold(state, stateObj, rect) {
    const isClosed = state[1] !== 'open'
    this.body.style.overflow = isClosed ? SCROLL : HIDDEN
    this.element.style[this.directionString] = stateObj.dimension
    const overallEventTime = stateObj.TIMING

    if (overallEventTime / 1e3 < 0.7) {
      console.log(overallEventTime)
      const displacement = this.direction === BoundDrawer.UP || this.direction === BoundDrawer.DOWN ? rect.displacementY : rect.displacementX

      if(displacement > 0 && displacement >= 40 && rect.wGTh()) {
        this.body.style.overflow = !isClosed ? SCROLL : HIDDEN
        this.element.style[this.directionString] = stateObj.oppositeDimension
        console.log(`yeah ${rect.width}`)
      }

    }
  }
}

export default NavDrawer
