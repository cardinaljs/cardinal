import {Backdrop} from './backdrop'
import HashState from './hashstate'
import NavDrawer from './drawer'
import NavService from './navservice'
import {css, getData, getAttribute, hasAttribute, setAttribute, unique, $} from '../util'

const BACKDROP = "backdrop"
const DEF_CLASSNAME = "cardinal-navcard"
const MEDIA_HASH = "data-hash-max-width"
const MEDIA_DRAW = "data-draw-max-width"
const _CLASS = "class"
const EVENTS = {
  touchend: "touchend",
  touchmove: "touchmove",
  touchstart: "touchstart"
}

class NavCard {

  constructor() {
    // **Do not insert the below element into DOM**
    /**
     * **Covert Backdrop**
     * just incase `options.backdrop = false`
     * prevent multiple `if` statements
     * so we don't have to check whether
     * backdrop is enabled anytime we want to access it
     * insert into DOM only:
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
      left: 0,
      zIndex: -1
    })

    this.body = document.body
    // init with null
    this.Drawer = null
    this.NavService = null
    this.HashState = null

    NavCard.defaultConfig = {
      type: "nav",
      transition: 500,
      event: "click",
      direction: "left",
      backdrop: false,
      backdropClass: null,
      accessAttr: "data-target",
      maxStartArea: 25,
      threshold: 1/2,
      unit: 'px'
    }

    NavCard.API = {
      DEFAULT: 0,
      DRAWER: 1,
      HASH: 2,
    }
  }

  setup(_elem, options) {
    let element,
      backdrop,
      dataAccess,
      opts,
      HASH_NAV_MAX_WIDTH,
      NAV_DRAW_MAX_WIDTH,
      destinationId,
      destination

    opts = NavCard.defaultConfig

    if (options && "object" === typeof options) {
      for (let prop of Object.keys(options)) {
        if (opts.hasOwnProperty(prop))
          opts[prop] = options[prop]
        else
          continue
      }
    }

    if (opts.backdrop) {
      let backdrop_class = !!opts.backdropClass ? opts.backdropClass : false
      // if `opts.backdrop` and no `backdrop_class` given
      // append our custom backdrop
      if (!backdrop_class) this.body.append(this.backdrop)

      if (typeof backdrop_class === 'string') {
        // check if backdrop_class is normal string or css class selector
        backdrop =  /^\./.test(backdrop_class) ? backdrop_class : `.${backdrop_class}`
        this.backdrop = $(backdrop)
      }

    }

    dataAccess = opts.accessAttr

    /**
     * Initialization element e.g <button ...</button>
     */
    element = $(_elem)
    destinationId = getData(element, dataAccess)

    // check if the data-* attribute value is a valid css selector
    // if not prepend a '#' to it as id selector is default
    let isCSS_Selector = /^(?:\#|\.|\u005b[^\u005c]\u005c)/.test(destinationId),
    isClass = /^\./.test(destinationId)
    destinationId = isCSS_Selector ? destinationId : `#${destinationId}`

    destination = $(destinationId)

    // we want a class too so in case we've got an id selector
    // find the classname or assign a unique class
    let default_class = `${DEF_CLASSNAME}-${unique(2<<7)}`
    let classname = isClass ? destinationId : hasAttribute(destination, _CLASS) ? getAttribute(destination, _CLASS) : (setAttribute(destination, _CLASS, default_class), default_class)
    let classlist = classname.split(/\s+/)
    classname = "." + ((classlist.length >= 2) ? classlist[0] + "." + classlist[1] : classname)
    destination = isClass ? destination : $(classname)

    // These attributes are used for the RWD(Responsive Web Design)
    // features. The navigation drawer module is best suited for mobile
    // touch devices. The program shouldn't listen for certain events on
    // desktop devices as side-nav may be hidden. The attribute here are
    // the screen sizes after which the nav is hidden.
    HASH_NAV_MAX_WIDTH = getData(destination, MEDIA_HASH)
    NAV_DRAW_MAX_WIDTH = getData(destination, MEDIA_DRAW)
    HASH_NAV_MAX_WIDTH = /px$/.test(HASH_NAV_MAX_WIDTH) ? HASH_NAV_MAX_WIDTH : `${HASH_NAV_MAX_WIDTH}px`
    NAV_DRAW_MAX_WIDTH = /px$/.test(NAV_DRAW_MAX_WIDTH) ? NAV_DRAW_MAX_WIDTH : `${NAV_DRAW_MAX_WIDTH}px`

    let defaultOptions = {
      ELEMENT: destination,
      INIT_ELEM: element,
      BACKDROP: new Backdrop(this.backdrop),
      BODY: this.body,
      TRANSITION: opts.transition,
      DIRECTION: ['top', 'left', 'bottom', 'right'][opts.direction],
      unit: options.unit
    }
    let drawerOptions = {
      ...defaultOptions,
      MAX_WIDTH: NAV_DRAW_MAX_WIDTH,
      ...EVENTS,
      DIRECTION: opts.direction,
      maxStartArea: opts.maxStartArea,
      threshold: opts.threshold
    }
    let hashOptions = {
      ...defaultOptions,
      MAX_WIDTH: HASH_NAV_MAX_WIDTH
    }

    this._drawerAPI(drawerOptions).activate()
    this._hashAPI(hashOptions).activate()
    this._defaultAPI(defaultOptions).activate()

  }

  _drawerAPI(options) {
    this.Drawer = new NavDrawer(options)
    return {
      activate: () => this.Drawer.activate(),
      deactivate: () => this.Drawer.deactivate()
    }
  }

  _hashAPI(options) {
    this.HashState = new HashState(options)
    return {
      activate: () => this.HashState.activate(),
      deactivate: () => this.HashState.deactivate(),
    }
  }

  _defaultAPI(options) {
    this.NavService = new NavService(options)
    return {
      activate: () => this.NavService.activate(),
      deactivate: () => this.NavService.deactivate(),
    }
  }

  terminate(state) {
    // this._*API(null).deactivate()
    switch(state) {
      case NavCard.API.DEFAULT:
        if (this.NavService instanceof NavService)
          this.NavService.deactivate()
        break
      case NavCard.API.DRAWER:
        if (this.Drawer instanceof Drawer)
          this.Drawer.deactivate()
        break
      case NavCard.API.HASH:
        if (this.HashState instanceof HashState)
          this.HashState.deactivate()
        break
      default:
        this._drawerAPI(null).deactivate()
        this._hashAPI(null).deactivate()
        this._defaultAPI(null).deactivate()
    }
  }
}

export default NavCard
