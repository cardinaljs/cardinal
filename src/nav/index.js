import {
  $,
  DIRECTIONS,
  css,
  getAttribute,
  getData,
  hasAttribute,
  setAttribute,
  unique
} from './../util'
import {
  Backdrop
} from './backdrop'
import HashState from './hashstate'
import NavDrawer from './drawer'
import NavService from './navservice'

const BACKDROP = 'backdrop'
const DEF_CLASSNAME = 'cardinal-navcard'
const MEDIA_HASH = 'data-hash-max-width'
const MEDIA_DRAW = 'data-draw-max-width'
const _CLASS = 'class'

class NavCard {
  constructor() {
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

    this.body = document.body
    this.Drawer = null
    this.NavService = null
    this.HashState = null
  }

  static defaultConfig = {
    transition: 500,
    direction: 'left',
    backdrop: false,
    backdropClass: null,
    accessAttr: 'data-target',
    maxStartArea: 25,
    threshold: 1 / 2,
    unit: 'px'
  }

  static SERVICES = {
    Default: 2,
    Drawer: 4,
    Hash: 8
  }

  setup(el, options) {
    if (!el) {
      throw new TypeError('expected \'el\' to be selector string or HTMLElement')
    }
    let {
      backdrop,
      HASH_NAV_MAX_WIDTH,
      NAV_DRAW_MAX_WIDTH,
      destinationId,
      destination
    } = 1
    const opts = NavCard.defaultConfig

    if (options && typeof options === 'object') {
      for (const prop of Object.keys(options)) {
        if (Object.prototype.hasOwnProperty.call(opts, prop)) {
          opts[prop] = options[prop]
        } else {
          continue
        }
      }
    }

    const dataAccess = opts.accessAttr

    /**
     * Initialization element e.g <button ...</button>
     */
    const element = el instanceof HTMLElement ? el : $(el)
    destinationId = getData(element, dataAccess)

    // check if the data-* attribute value is a valid css selector
    // if not prepend a '#' to it as id selector is default
    const isCSSSelector = /^(?:#|\.|\u005b[^\u005c]\u005c)/.test(destinationId)
    const isClass = /^\./.test(destinationId)
    destinationId = isCSSSelector ? destinationId : `#${destinationId}`

    destination = $(destinationId)

    // we want a class too, so in case we've got an id selector
    // find the classname or assign a unique class
    const defaultClass = `${DEF_CLASSNAME}-${unique(2 << 7)}`
    // eslint-disable-next-line no-nested-ternary
    let classname = isClass ? destinationId : hasAttribute(destination, _CLASS)
      ? getAttribute(destination, _CLASS) : (setAttribute(destination, _CLASS, defaultClass), defaultClass)
    const classlist = classname.split(/\s+/)
    // eslint-disable-next-line prefer-template
    classname = '.' + (classlist.length >= 2 ? classlist[0] + '.' + classlist[1] : classname)
    destination = isClass ? destination : $(classname)

    if (opts.backdrop) {
      const backdropclass = opts.backdropClass || false
      // if `opts.backdrop` and no `backdropclass` given
      // append our custom backdrop
      if (!backdropclass) {
        destination.insertAdjacentElement('beforeBegin', this.backdrop)
      }

      if (typeof backdropclass === 'string') {
        // check if backdropclass is normal string or css class selector
        backdrop =  /^\./.test(backdropclass) ? backdropclass : `.${backdropclass}`
        this.backdrop = $(backdrop)
      }
    }

    HASH_NAV_MAX_WIDTH = getData(destination, MEDIA_HASH)
    NAV_DRAW_MAX_WIDTH = getData(destination, MEDIA_DRAW)
    HASH_NAV_MAX_WIDTH = /px$/.test(HASH_NAV_MAX_WIDTH) ? HASH_NAV_MAX_WIDTH : `${HASH_NAV_MAX_WIDTH}px`
    NAV_DRAW_MAX_WIDTH = /px$/.test(NAV_DRAW_MAX_WIDTH) ? NAV_DRAW_MAX_WIDTH : `${NAV_DRAW_MAX_WIDTH}px`

    const defaultOptions = {
      ELEMENT: destination,
      INIT_ELEM: element,
      BACKDROP: new Backdrop(this.backdrop),
      BODY: this.body,
      TRANSITION: opts.transition,
      DIRECTION: DIRECTIONS[opts.direction],
      unit: options.unit
    }
    const drawerOptions = {
      ...defaultOptions,
      MAX_WIDTH: NAV_DRAW_MAX_WIDTH,
      DIRECTION: opts.direction,
      maxStartArea: opts.maxStartArea,
      threshold: opts.threshold
    }
    const hashOptions = {
      ...defaultOptions,
      MAX_WIDTH: HASH_NAV_MAX_WIDTH
    }

    return new NavMountWorker(Object.assign({}, {
      defaultOptions
    }, {
      drawerOptions
    }, {
      hashOptions
    }))
  }

  toString() {
    return '[object NavCard]'
  }

  _drawerAPI(options) {
    this.Drawer = new NavDrawer(options)
    return {
      activate: () => this.Drawer.activate(),
      deactivate: () => this.Drawer.deactivate()
    }
  }

  _hashAPI(options) {
    this.HashState = new HashState(this.NavService, options)
    return {
      activate: () => this.HashState.activate(),
      deactivate: () => this.HashState.deactivate()
    }
  }

  _defaultAPI(options) {
    this.NavService = new NavService(options)
    return {
      activate: () => this.NavService.activate(),
      deactivate: () => this.NavService.deactivate()
    }
  }

  terminate(service) {
    // this._*API(null).deactivate()
    switch (service) {
      case NavCard.SERVICES.Default:
        if (this.NavService instanceof NavService) {
          this.NavService.deactivate()
        }
        break
      case NavCard.SERVICES.Drawer:
        if (this.Drawer instanceof NavDrawer) {
          this.Drawer.deactivate()
        }
        break
      case NavCard.SERVICES.Hash:
        if (this.HashState instanceof HashState) {
          this.HashState.deactivate()
        }
        break
      default:
        throw new Error('a service id is required')
    }
  }
}

class NavMountWorker extends NavCard {
  constructor(options) {
    super()
    this.options = options
  }

  mount() {
    this._defaultAPI(this.options.defaultOptions).activate()
    this._drawerAPI(this.options.drawerOptions).activate()
    this._hashAPI(this.options.hashOptions).activate()
  }

  unmount() {
    this.NavService.forceDeactivate()
    this.Drawer.deactivate()
    this.HashState.deactivate()
  }
}

export default NavCard
