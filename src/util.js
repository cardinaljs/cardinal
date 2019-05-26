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

export function unique(max) {
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

export function getData(el, attr) {
  const prop = dataCamelCase(attr)
  // this may return `undefined` in some Safari
  if (el.dataset && el.dataset[prop]) {
    return el.dataset[prop]
  }
  return getAttribute(el, attr.substring(5))
}

export function validateThreshold(tsh) {
  const MAX_THRESHOLD = 1
  const MIN_ILLEGAL_THRESHOLD = 0
  if (tsh < MAX_THRESHOLD && tsh > MIN_ILLEGAL_THRESHOLD) {
    tsh = MAX_THRESHOLD - tsh
    return tsh
  } else if (tsh < MIN_ILLEGAL_THRESHOLD) {
    tsh = MAX_THRESHOLD
    return tsh
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
  const STYLEMAP = window.getComputedStyle(el)

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
  } else if (property instanceof Array) {
    // return all values of properties in the array for
    // the element as object
    const ostyle = {}
    for (const prop of STYLEMAP) {
      ostyle[prop] = STYLEMAP[prop]
    }
    return ostyle
  } else {
    // get style from property
    return STYLEMAP[property]
  }
  return STYLEMAP
}
