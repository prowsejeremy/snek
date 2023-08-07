class EventEmitter {

  constructor(events = {}) {
    this.events = events
  }

  on(name, cb) {
    (this.events[name] || (this.events[name] = [])).push(cb)

    return {
      off: () => {
        this.events[name] && this.events[name].splice(this.events[name].indexOf(cb) >>> 0, 1)
      }
    }
  }

  emit(name, ...args) {
    (this.events[name] || []).forEach(fn => fn(...args))
  }
}

module.exports = EventEmitter