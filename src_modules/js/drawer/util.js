export default class Final {

  static START = 2
  static HIDDEN = 'hidden'
  static ZERO = 0
  static DISPLAY = 'block'

  static validateThreshold(tsh) {
    if (tsh < 1) {
      tsh = 1 - tsh
      return tsh
    } else if (tsh >= 1) {
      tsh = 1 / 1e10
      return tsh
    }
  }
}
