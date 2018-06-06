function Output (joy) {
  this.clear()
}

Output.prototype.clear = function clear () {
  this.value = ''
  return this
}

Output.prototype.write = function write (line) {
  this.value += line
  return this
}

Output.prototype.toString = function toString () {
  return this.value
}

module.exports = Output
