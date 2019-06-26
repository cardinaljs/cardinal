import {
  NAVSTATE_EVENTS, WINDOW
} from './../util'
import NavCard from '../nav/index'
import SheetDrawer from './drawer'
import SheetService from './sheetservice'

const CLASS_TYPE = '[object Sheet]'
const NAME = 'Sheet'
const SHEET = WINDOW[NAME] || null


class Sheet extends NavCard {
  constructor(src, dest) {
    super(src, dest)
    this.SheetService = null
    Sheet.defaultConfig.threshold = 2 / 3
  }

  /**
   * @override
   */
  setup(options) {
    const navMountWorker = super.setup(options)
    return new SheetMountWorker(navMountWorker.options)
  }

  /**
   * @override
   */
  terminate(service) {
    service |= 0
    if (service & NavCard.SERVICES.Default && this.SheetService instanceof SheetService) {
      this.SheetService.deactivate()
    }
    if (service & NavCard.SERVICES.Drawer && this.Drawer instanceof SheetDrawer) {
      this.Drawer.deactivate()
    }
    if (service & NavCard.SERVICES.Pop && this.PopService) {
      /**
       * we can't strictly determine that `this.PopService`
       * is an instance of PopService class.
       * This is an edge case as there is no access to that
       * type.
       */
      this.PopService.deactivate() // or super.terminate(...)
    }
    if (!service) {
      throw new Error('a service id is required')
    }
  }

  /**
   * @override
   */
  toString() {
    return CLASS_TYPE
  }

  /**
   * @override
   */
  static namespace(name) {
    WINDOW[name] = WINDOW[name] || {}
    WINDOW[name][NAME] = Sheet
    WINDOW[NAME] = SHEET
  }

  /**
   * @override
   */
  _drawerAPI(options) {
    this.Drawer = new SheetDrawer(options, this.State)
    return {
      activate: () => this.Drawer.activate(),
      deactivate: () => this.Drawer.deactivate()
    }
  }

  /**
   * @override
   */
  _hashAPI(options) {
    const Interface = super._hashAPI(options)
    this.PopService.parentService = this.SheetService
    return Interface
  }

  /**
   * @override
   */
  _defaultAPI(options) {
    this.SheetService = new SheetService(options, this.State)
    return {
      activate: () => this.SheetService.activate(),
      deactivate: () => this.SheetService.deactivate()
    }
  }
}

class SheetMountWorker extends Sheet {
  constructor(options) {
    super()
    this.options = options
  }

  mount() {
    const DEFAULT_ACTIVE = !this._defaultAPI(this.options.defaultOptions).activate()
    const DRAWER_ACTIVE = !this._drawerAPI(this.options.drawerOptions).activate()
    const HASH_ACTIVE = !this._hashAPI(this.options.hashOptions).activate()
    return new Promise((resolve, reject) => {
      if (!(DEFAULT_ACTIVE && DRAWER_ACTIVE && HASH_ACTIVE)) {
        reject(new Error('one or more services could not activate'))
        return
      }
      resolve(new SheetStateEvent(this.State))
    })
  }

  unmount() {
    this.SheetService.forceDeactivate()
    this.Drawer.deactivate()
    this.PopService.deactivate()
  }

  toString() {
    return '[object SheetMountWorker]'
  }
}

class SheetStateEvent {
  events = [NAVSTATE_EVENTS.show, NAVSTATE_EVENTS.hide]
  constructor(state) {
    this._State = state
  }
  on(event, handle) {
    if (!(this.events.indexOf(event) + 1)) {
      throw new Error(`unknown event '${event}'`)
    }
    this._State[`on${event}`] = handle
  }
  off(event) {
    if (!(this.events.indexOf(event) + 1)) {
      throw new Error(`unknown event '${event}'`)
    }
    this._State[`on${event}`] = null
  }
}

export default Sheet
