import STATE from './state'
import {
  getAttribute
} from './../util'

class HashState {
  constructor(parentService, options) {
    this.options = options
    this.parentService = parentService
    this.button = options.INIT_ELEM
    this.event = 'hashchange'
    this.handler = null
  }

  activate() {
    const handler = (e) => {
      this._hashchange(e)
    }
    this._register(handler)
    window.addEventListener(this.event, this.handler)
    return 0
  }

  deactivate() {
    window.removeEventListener(this.event, this.handler)
    this._register(null)
    return 0
  }

  _hashchange(e) {
    const oldHash = HashState._getHash(e.oldURL)
    if (oldHash === getAttribute(this.button, 'href') && STATE.navstate && STATE.navstate.alive) {
      this.parentService._close()
    }
  }

  _register(handler) {
    this.handler = handler
  }

  static _getHash(uri) {
    let hash = uri
    const indexOfHash = hash.lastIndexOf('#')
    hash = indexOfHash !== -1 ? hash.slice(indexOfHash).replace(/(?:[^\w\d-]+)$/) : null
    return hash
  }
}

export default HashState
