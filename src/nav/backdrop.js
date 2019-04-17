import {css} from '../util'

export class Backdrop {
  constructor(backdrop) {
    this.backdrop = backdrop
  }

  show(time) {
    css(this.backdrop, {
      display: 'block',
      opacity: 1,
      transition: `opacity linear ${time / 1e3}`
    })
  }

  hide(time) {
    css(this.backdrop, {
      opacity: 0,
      transition: `opacity linear ${time / 1e3}`
    })
    window.setTimeout(() => {
      css(this.backdrop, {
        display: 'none'
      })
    }, time)
  }

  setOpacity(val) {
    css(this.backdrop, {
      display: 'block',
      opacity: val,
      transition: 'none'
    })
  }
}
