export class Service {
  constructor(event) {
    this._event = event
  }

  lock() {
    this._event.stopImmediatePropagation()
  }

  inhibitSubTask() {
    this._event.preventDefault()
  }
}
