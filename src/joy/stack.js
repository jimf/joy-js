function Stack () {
  var _this = this
  this._data = []
  Object.defineProperty(this, 'length', {
    get: function get () {
      return _this._data.length
    }
  })
}

Stack.prototype.pop = function pop () {
  if (this.length > 0) {
    return this._data.pop()
  }
  throw new RangeError('Cannot pop from empty stack')
}

Stack.prototype.push = function push (value) {
  this._data.push(value)
}

Stack.prototype.peek = function peek (n) {
  return n === 0 ? [] : this._data.slice(-n)
}

Stack.prototype.restoreAfter = function restore (fn) {
  const memento = this._data.slice(0)
  const result = fn()
  this._data = memento
  return result
}

Stack.prototype.toString = function toSring () {
  return this._data.toString()
}

module.exports = Stack
