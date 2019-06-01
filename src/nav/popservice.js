import {
  getAttribute,
  getData
} from '../util'
import STATE from './state'

class PopService {
  constructor(parentService, options) {
    this.options = options
    this.parentService = parentService
    this.button = options.INIT_ELEM
    this.event = 'hashchange'
    this.handler = null
  }

  activate() {
    const handler = (hashChangeEvent) => {
      this._hashchange(hashChangeEvent)
    }
    this._register(handler)
    window.addEventListener(this.event, this.handler, true)
    return 0
  }

  deactivate() {
    window.removeEventListener(this.event, this.handler, true)
    this._register(null)
    return 0
  }

  /**
   * @param {HashChangeEvent} hashChangeEvent Event object
   * @returns {void}
   */
  _hashchange(hashChangeEvent) {
    const oldHash = PopService._getHash(hashChangeEvent.oldURL)
    if (oldHash === (getAttribute(this.button, 'href') ||
    getData(this.button, 'data-href')) &&
    STATE.navstate && STATE.navstate.alive) {
      hashChangeEvent.stopImmediatePropagation()
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

export default PopService
