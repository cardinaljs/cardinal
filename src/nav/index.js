import {
  $,
  ActivityManager,
  DIRECTIONS,
  NAVSTATE_EVENTS,
  WINDOW,
  css,
  getData
} from './../util'
import {
  Backdrop
} from './backdrop'
import NavDrawer from './drawer'
import NavService from './navservice'
import PopService from './popservice'
import State from './state'

const BACKDROP = 'backdrop'
const MEDIA_DRAW = 'data-max-width'
const CLASS_TYPE = '[object NavCard]'
const NAME = 'Nav'
const NAV = WINDOW[NAME] || null

class NavCard {
  constructor(src, dest) {
    /**
     * Covert Backdrop
     * ----------------
     * Just incase `options.backdrop = false`
     * prevents multiple `if` statements
     * so we don't have to check whether
     * backdrop is enabled anytime we want to access it.
     *
     * Insert into DOM only:
     * when `options.backdrop = true`
     * `options.backdropClass` is undefined
     */
    this.backdrop = document.createElement('div')
    this.backdrop.className = BACKDROP
    css(this.backdrop, {
      background: 'rgba(0,0,0,.4)',
      height: '100%',
      width: '100%',
      display: 'none',
      position: 'fixed',
      top: 0,
      left: 0
    })
    this.src = src
    this.dest = dest
    this.body = document.body
    this.Drawer = null
    this.SheetService = null
    this.PopService = null
    this._Activity = new ActivityManager(this)
    this.State = new State(this._Activity)
  }

  static defaultConfig = {
    transition: 500,
    direction: -1,
    useBackdrop: false,
    backdrop: null,
    dest: null,
    scrollableContainer: null,
    maxStartArea: 25,
    threshold: 1 / 2,
    unit: 'px',
    CustomDrawer: null
  }

  static SERVICES = {
    Default: 0x20,
    Drawer: 0x40,
    Pop: 0x80
  }

  setup(options) {
    if (!this.src) {
      throw new TypeError(
        `expected ${NAME} to be constructed with at least 'src' argument:
        expected 'src' to be selector string or HTMLElement.
          constructor(src: string | HTMLElement, dest?: string | HTMLElement)`
      )
    }

    const opts = typeof Object.assign === 'function' ? Object.assign({}, NavCard.defaultConfig) : {
      ...NavCard.defaultConfig
    }

    if (options && typeof options === 'object') {
      for (const prop of Object.keys(options)) {
        if (Object.prototype.hasOwnProperty.call(opts, prop)) {
          opts[prop] = options[prop]
        } else {
          continue
        }
      }
    }

    this.dest = this.dest ? this.dest : opts.dest

    const srcEl = this.src instanceof HTMLElement ? this.src : $(this.src)
    const destEl = this.dest instanceof HTMLElement ? this.dest : $(this.dest)
    let maxWidth  = getData(destEl, MEDIA_DRAW)

    if (opts.useBackdrop) {
      const backdropclass = opts.backdrop || false
      // if `opts.useBackdrop` and no `backdrop` given
      // append a custom backdrop
      if (!backdropclass) {
        destEl.insertAdjacentElement('beforeBegin', this.backdrop)
      } else if (typeof backdropclass === 'string') {
        // check if backdropclass is normal string or css class selector
        const backdrop =  /^\./.test(backdropclass) ? backdropclass : `.${backdropclass}`
        this.backdrop = $(backdrop)
      } else if (backdropclass instanceof HTMLElement) {
        this.backdrop = backdropclass
      } else {
        throw new TypeError('expected \'options.backdrop\' to be a selector string or HTMLElement.')
      }
    }

    maxWidth = /px$/.test(maxWidth) ? maxWidth : `${maxWidth}px`
    const defaultOptions = {
      ELEMENT: destEl,
      INIT_ELEM: srcEl,
      BACKDROP: new Backdrop(this.backdrop),
      BODY: this.body,
      TRANSITION: opts.transition,
      DIRECTION: DIRECTIONS[opts.direction],
      unit: opts.unit
    }
    const drawerOptions = {
      ...defaultOptions,
      MAX_WIDTH: maxWidth,
      DIRECTION: opts.direction,
      maxStartArea: opts.maxStartArea,
      threshold: opts.threshold,
      scrollableContainer: opts.scrollableContainer,
      CustomDrawer: opts.CustomDrawer
    }
    const hashOptions = {
      INIT_ELEM: defaultOptions.INIT_ELEM
    }

    return new NavMountWorker(this, {
      defaultOptions,
      drawerOptions,
      hashOptions
    })
  }

  terminate(service) {
    service |= 0
    if (service & NavCard.SERVICES.Default && this.SheetService instanceof NavService) {
      this.SheetService.deactivate()
    }
    if (service & NavCard.SERVICES.Drawer && this.Drawer instanceof NavDrawer) {
      this.Drawer.deactivate()
    }
    if (service & NavCard.SERVICES.Hash && this.PopService instanceof PopService) {
      this.PopService.deactivate()
    }
    if (!service) {
      throw new Error('a service id is required')
    }
  }

  toString() {
    return CLASS_TYPE
  }

  static namespace(name) {
    WINDOW[name] = WINDOW[name] || {}
    WINDOW[name][NAME] = NavCard
    WINDOW[NAME] = NAV
  }

  _drawerAPI(options) {
    const {
      CustomDrawer: Drawer
    } = options
    this.Drawer = Drawer && typeof Drawer === 'object' ? new Drawer(options, this.State) : new NavDrawer(options, this.State)
    return {
      activate: () => this.Drawer.activate(),
      deactivate: () => this.Drawer.deactivate()
    }
  }

  _hashAPI(options) {
    this.PopService = new PopService(this.SheetService, options, this.State)
    return {
      activate: () => this.PopService.activate(),
      deactivate: () => this.PopService.deactivate()
    }
  }

  _defaultAPI(options) {
    this.SheetService = new NavService(options, this.State)
    return {
      activate: () => this.SheetService.activate(),
      deactivate: () => this.SheetService.deactivate()
    }
  }
}

class NavMountWorker {
  constructor(borrowedContext, options) {
    this.$this = borrowedContext
    this.options = options
  }

  mount() {
    const DEFAULT_ACTIVE = !this.$this._defaultAPI(this.options.defaultOptions).activate()
    const DRAWER_ACTIVE = !this.$this._drawerAPI(this.options.drawerOptions).activate()
    const HASH_ACTIVE = !this.$this._hashAPI(this.options.hashOptions).activate()
    return new Promise((resolve, reject) => {
      if (!(DEFAULT_ACTIVE && DRAWER_ACTIVE && HASH_ACTIVE)) {
        reject(new Error('one or more services could not activate'))
        return
      }
      resolve(new NavStateEvent(this.$this, this.$this.State))
    })
  }

  unmount() {
    this.$this.SheetService.forceDeactivate()
    this.$this.Drawer.deactivate()
    this.$this.PopService.deactivate()
  }

  toString() {
    return '[object NavMountWorker]'
  }
}

class NavStateEvent {
  events = [NAVSTATE_EVENTS.show, NAVSTATE_EVENTS.hide]
  constructor($this, state) {
    this.$this = $this
    this._State = state
  }
  on(event, handle = () => false) {
    if (!(this.events.indexOf(event) + 1)) {
      throw new Error(`unknown event '${event}'`)
    }
    this._State[`on${event}`] = handle.bind(this.$this)
  }
  off(event) {
    if (!(this.events.indexOf(event) + 1)) {
      throw new Error(`unknown event '${event}'`)
    }
    this._State[`on${event}`] = null
  }
}

export default NavCard
