import NavService from './navservice'

const TRANSITION_STYLE = 'ease'

class HashState {
  constructor(options) {
    this.options = options
    this.nav = options.ELEMENT
    this.button = options.INIT_ELEM
    this.backdrop = options.BACKDROP
    this.event = 'hashchange'
    this.direction = options.DIRECTION
    this.width = this.nav.offSetWidth
    this.transTime = options.transition / 1e3
    this.transition = `${this.direction} ${TRANSITION_STYLE} ${this.transTime}s`
    // state of the nav, whether open or close
    this.alive = false
  }

  activate() {
    window.addEventListener(this.event, this.handler)
    return 0
  }

  handler(e) {
    const hash = HashState._getHash(e)
    const ns = new NavService(this.options)
    if (hash === null) {
      ns._close()
    } else if (hash === this.button.getAttribute('href')) {
      ns._open()
    }
  }

  static _getHash(e) {
    let hash = e.newURL
    const indexOfHash = hash.lastIndexOf('#')
    hash = indexOfHash !== -1 ? hash.slice(indexOfHash).replace(/(?:[^\w\d-]+)$/) : null
    return hash
  }

  deactivate() {
    window.removeEventListener(this.event, this.handler)
    return 0
  }
}

export default HashState
