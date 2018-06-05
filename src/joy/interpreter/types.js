function JoyBase (value) {
  this.value = value
  Object.defineProperty(this, 'isNonEmptyAggregate', {
    get: () => {
      if (!this.isAggregate) { return false }
      return (this.length || this.value.length) !== 0
    }
  })
}
JoyBase.prototype.ap = function (other) {
  return other.map(this.value)
}
JoyBase.prototype.map = function (f) {
  return new this.constructor(f(this.value))
}
JoyBase.prototype.toString = function () {
  return this.value.toString()
}

function JoyInt (value) {
  JoyBase.call(this, value)
  this.isInteger = true
  this.isNumeric = true
}
JoyInt.prototype = Object.create(JoyBase.prototype)
JoyInt.prototype.constructor = JoyInt
JoyInt.from = function (other) {
  if (other.isFloat) {
    return new JoyInt(Math.trunc(other.value))
  } else if (other.isCharacter) {
    return new JoyInt(other.toNumber())
  } else if (typeof other === 'number') {
    return new JoyInt(Math.floor(other))
  } else if (typeof other === 'string' && other.length === 1) {
    return new JoyInt(other.charCodeAt(0))
  }
  throw new Error('Cannot convert ' + other + ' to Integer')
}
JoyInt.prototype.toNumber = function () {
  return this.value
}

function JoyFloat (value) {
  JoyBase.call(this, value)
  this.isFloat = true
}
JoyFloat.prototype = Object.create(JoyBase.prototype)
JoyFloat.prototype.constructor = JoyFloat
JoyFloat.from = function (other) {
  if (other.isInteger) {
    return new JoyFloat(other.value)
  } else if (typeof other === 'number') {
    return new JoyFloat(other)
  } else if (other.isString) {
    return new JoyFloat(parseFloat(other.value))
  } else if (typeof other === 'string') {
    return new JoyFloat(parseFloat(other))
  }
  throw new Error('Cannot convert ' + other + ' to Float')
}
JoyFloat.prototype.toString = function () {
  const retval = this.value.toString()
  return retval.includes('.') ? retval : `${retval}.0`
}

function JoyChar (value) {
  JoyBase.call(this, value)
  this.isCharacter = true
  this.isNumeric = true
}
JoyChar.prototype = Object.create(JoyBase.prototype)
JoyChar.prototype.constructor = JoyChar
JoyChar.from = function (other) {
  if (other.isInteger) {
    return new JoyChar(String.fromCharCode(other.value))
  } else if (typeof other === 'number') {
    return new JoyChar(String.fromCharCode(other))
  } else if (other.isString && other.value.length === 1) {
    return new JoyChar(other.value)
  } else if (typeof other === 'string' && other.length === 1) {
    return new JoyChar(other.value)
  }
  throw new Error('Cannot convert ' + other + ' to Character')
}
JoyChar.prototype.toNumber = function () {
  return this.value.charCodeAt(0)
}

function JoyString (value) {
  JoyBase.call(this, value)
  this.isString = true
  this.isAggregate = true
}
JoyString.prototype = Object.create(JoyBase.prototype)
JoyString.prototype.constructor = JoyString
JoyString.from = function (other) {
  if (other.isCharacter) {
    return new JoyString(other.value)
  }
  throw new Error('Cannot convert ' + other + ' to String')
}

function JoyBool (value) {
  JoyBase.call(this, value)
  this.isBool = true
  this.isLogical = true
}
JoyBool.prototype = Object.create(JoyBase.prototype)
JoyBool.prototype.constructor = JoyBool

function JoyList (value) {
  JoyBase.call(this, value)
  this.isList = true
  this.isAggregate = true
}
JoyList.prototype = Object.create(JoyBase.prototype)
JoyList.prototype.constructor = JoyList
JoyList.prototype.toString = function () {
  return `[${this.value.map(x => x.toString()).join(' ')}]`
}

function JoyQuotation (value) {
  JoyBase.call(this, value)
  this.isQuotation = true
  this.isAggregate = true
}
JoyQuotation.prototype = Object.create(JoyBase.prototype)
JoyQuotation.prototype.constructor = JoyQuotation
JoyQuotation.prototype.toString = function () {
  return `[${this.value.map(x => x.toString()).join(' ')}]`
}

function JoySet (value) {
  JoyBase.call(this, null)
  this._values = {}
  this._smallest = -1
  this._length = 0
  value.forEach((val) => {
    this.add(val)
  })
  this.isSet = true
  this.isAggregate = true
  Object.defineProperty(this, 'length', {
    get: () => this._length
  })
}
JoySet.prototype = Object.create(JoyBase.prototype)
JoySet.prototype.constructor = JoySet
JoySet.prototype.add = function (item) {
  // TODO: throw if value exceeds 31?
  const value = item.toNumber()
  if (this.has(value)) { return }
  this._values[value] = item
  this._length += 1
  if (value < this._smallest) {
    this._smallest = value
  }
  return this
}
JoySet.prototype.has = function (item) {
  return !!this._values[item.value]
}
JoySet.prototype.forEach = function (fn) {
  Object.keys(this._values).forEach((key) => {
    fn(this._values[key])
  })
}
JoySet.prototype.union = function (other) {
  const result = new JoySet([])
  this.forEach((x) => { result.add(x) })
  other.forEach((x) => { result.add(x) })
  return result
}
JoySet.prototype.intersect = function (other) {
  const result = new JoySet([])
  this.forEach((x) => {
    if (other.has(x)) {
      result.add(x)
    }
  })
  return result
}
JoySet.prototype.symmetricDifference = function (other) {
  const result = new JoySet([])
  this.forEach((x) => {
    if (!other.has(x)) {
      result.add(x)
    }
  })
  other.forEach((x) => {
    if (!this.has(x)) {
      result.add(x)
    }
  })
  return result
}
JoySet.prototype.toString = function () {
  const entries = []
  this.forEach((x) => { entries.push(x.toString()) })
  return `{${entries.join(' ')}}`
}

function JoySymbol (value) {
  JoyBase.call(this, value)
  this.isSymbol = true
}
JoySymbol.prototype = Object.create(JoyBase.prototype)
JoySymbol.prototype.constructor = JoySymbol

module.exports = {
  JoyInt: JoyInt,
  JoyFloat: JoyFloat,
  JoyChar: JoyChar,
  JoyString: JoyString,
  JoyBool: JoyBool,
  JoyList: JoyList,
  JoyQuotation: JoyQuotation,
  JoySet: JoySet,
  JoySymbol: JoySymbol
}
