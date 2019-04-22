const MAX_THRESHOLD = 1
const MIN_ILLEGAL_THRESHOLD = 0

export const ZERO = 0

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
  Math.floor(Math.random() * max)
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
  return getAttribute(el, attr)
}

export function validateThreshold(tsh) {
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
 * @param {string | number} style value to set as
 * @returns {CSSStyleDeclaration | string} A css style property
 * or CSSStyleDeclaration object
 */
export function css(el, property, style = null) {
  const STYLEMAP = window.getComputedStyle(el)

  style = style || null
  property = property || null

  if (typeof property === 'string' && style !== null) {
    // setting one property
    el.style[property] = style
    return null
  }
  if (typeof property === 'object' && property instanceof Object) {
    // `style` MUST = null
    // setting many properties
    style = property
    for (const prop of Object.keys(style)) {
      el.style[prop] = style[prop]
    }
  } else if (property instanceof Array) {
    // return all values of properties in the array for
    // the element as object
    const ostyle = {}
    style = STYLEMAP
    for (const prop of style) {
      ostyle[prop] = style[prop]
    }
    return ostyle
  } else {
    // get style from property
    return STYLEMAP[property]
  }
  return STYLEMAP
}
