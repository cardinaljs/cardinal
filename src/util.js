// constants
const BLUR_SPREAD_SHADE = '0.7rem 0 rgba(0,0,0,.3)'
export const NAV_BOX_SHADOW = {
  top: `0 0.2rem ${BLUR_SPREAD_SHADE}`,
  left: `0.2rem 0 ${BLUR_SPREAD_SHADE}`,
  bottom: `0 -0.2rem ${BLUR_SPREAD_SHADE}`,
  right: `-0.2rem 0 ${BLUR_SPREAD_SHADE}`
}
export const ZERO = 0
export const DIRECTIONS = [
  'top', 'left',
  'bottom', 'right'
]
export const NAVSTATE_EVENTS = {
  show: 'show',
  hide: 'hide'
}
export const DrawerResponseInterface = {
  position: 'position',
  posOnStart: 'posOnStart',
  dimension: 'dimension',
  displacement: 'displacement',
  oppositeDimension: 'oppositeDimension',
  close: 'closing',
  open: 'opening'
}
export const WINDOW = window

// classes
export class Path {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * Get difference between two paths
   * @param {Path} path1 Path Object
   * @param {Path} path2 Path Object
   * @returns {Path} A different Path
   */
  static pathDifference(path1, path2) {
    const x = path1.x - path2.x
    const y = path1.y - path2.y
    return new Path(x, y)
  }

  /**
   * Join two different paths
   * @param {Path} path1 Path Object
   * @param {Path} path2 Path Object
   * @returns {Path} A joined Path
   */
  static join(path1, path2) {
    const x = path1.x + path2.x
    const y = path1.y + path2.y
    return new Path(x, y)
  }
}

export class Bound {
  constructor(lower, upper) {
    this.lower = lower
    this.upper = upper
  }

  get gap() {
    return this.upper - this.lower
  }

  get slack() {
    return this.lower - this.upper
  }
}

export class ActivityManager {
  constructor(activity) {
    this.activity = activity
    this.running = false
    this.id = Date.now()
  }

  run() {
    this.running = true
  }

  derun() {
    this.running = false
  }

  isRunning() {
    return this.running
  }
}

// functions
export function dataCamelCase(data) {
  // remove 'data-' prefix and return camelCase string
  return camelCase(data.substring(5), '-')
}

export function camelCase(data, delim = '-') {
  const list = data instanceof Array ? data : data.split(delim)
  return list.reduce((acc, cur) => acc + cur.charAt(0)
    .toUpperCase() + cur.slice(1)
  )
}

export function unique(max = 1) {
  return Math.floor(Math.random() * max)
}

export function $(query) {
  return document.querySelectorAll(query)[0]
}

export function getAttribute(el, attr) {
  return el.getAttribute(attr)
}

export function hasAttribute(el, attr) {
  return el.hasAttribute(attr)
}

export function setAttribute(el, attr, value) {
  el.setAttribute(attr, value)
}

export function getData(el, dataName) {
  const prop = dataCamelCase(dataName)
  // this may return `undefined` in some Safari
  if (el.dataset && el.dataset[prop]) {
    return el.dataset[prop]
  }
  return getAttribute(el, dataName.substring(5))
}

export function offsetRight(el) {
  return WINDOW.screen.availWidth - el.offsetLeft - el.offsetWidth
}

export function offsetBottom(el) {
  return WINDOW.screen.availHeight - el.offsetTop - el.offsetHeight
}

export function resolveThreshold(threshold) {
  const MAX_THRESHOLD = 1
  const MIN_ILLEGAL_THRESHOLD = 0
  if (threshold < MAX_THRESHOLD && threshold > MIN_ILLEGAL_THRESHOLD) {
    threshold = MAX_THRESHOLD - threshold
    return threshold
  } else if (threshold < MIN_ILLEGAL_THRESHOLD) {
    threshold = MAX_THRESHOLD
    return threshold
  }
  return MAX_THRESHOLD
}

/**
 * @param {HTMLElement} el an HTMLElement whose style should
 * be accessed
 * @param {string | string[] | {}} property A property/properties
 * to set or get
 * @param {string | number} value value to set as
 * @returns {CSSStyleDeclaration | string} A css style property
 * or CSSStyleDeclaration object
 */
export function css(...args) {
  if (args.length < 1) {
    return null
  }
  const el = args[0]
  const property = args[1]
  let value = args[2]
  const STYLEMAP = WINDOW.getComputedStyle(el)

  if (typeof property === 'string' && value) {
    // setting one property
    el.style[property] = value
    return null
  }
  if (typeof property === 'object' && property instanceof Object) {
    // `style` MUST = null
    // setting many properties
    value = property
    for (const prop of Object.keys(value)) {
      el.style[prop] = value[prop]
    }
    return null
  } else if (Array.isArray(property)) {
    // return all values of properties in the array for
    // the element as object
    const ostyle = {}
    for (const prop of STYLEMAP) {
      ostyle[prop] = STYLEMAP[prop]
    }
    return ostyle
  } else if (typeof property === 'string') {
    // get value of property
    return STYLEMAP[property]
  }
  return STYLEMAP
}
