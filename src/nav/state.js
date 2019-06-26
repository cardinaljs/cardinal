const EventInterface = {
  SHOW: 'show',
  HIDE: 'hide'
}

export default class State {
  constructor(activity) {
    this.activity = activity
    this._stateEventRegistry = {
      [EventInterface.SHOW]: null,
      [EventInterface.HIDE]: null
    }
  }

  set onshow(val) {
    if (typeof val !== 'function') {
      throw new TypeError('value is not a callable type')
    }
    this._stateEventRegistry.show = val
    return true
  }

  set onhide(val) {
    if (typeof val !== 'function') {
      throw new TypeError('value is not a callable type')
    }
    this._stateEventRegistry.hide = val
    return true
  }

  getStateEventHandler(type) {
    if (Object.values(EventInterface).indexOf(type) !== -1) {
      return this._stateEventRegistry[type]
    }
    throw new Error('unknown event type')
  }

  isRegisteredEvent(type) {
    return typeof this._stateEventRegistry[type] === 'function'
  }
}
