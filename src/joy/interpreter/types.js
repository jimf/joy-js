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

// function Aggregate () {

// }

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
JoyInt.prototype.equals = function (other) {
  return this.value === other.value
}
JoyInt.prototype.lte = function (other) {
  return this.equals(other) || this.value < other.value
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
JoyFloat.prototype.equals = function (other) {
  return this.value === other.value
}
JoyFloat.prototype.lte = function (other) {
  return this.equals(other) || this.value < other.value
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
JoyChar.prototype.toString = function () {
  // TODO: Add handling for escape sequences
  return `'${this.value.toString()}`
}
JoyChar.prototype.equals = function (other) {
  return this.value === other.value
}
JoyChar.prototype.lte = function (other) {
  return this.equals(other) || this.value < other.value
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
JoyString.prototype.first = function () {
  return new JoyChar(this.value.charAt(0))
}
JoyString.prototype.rest = function () {
  return this.map(x => x.slice(1))
}
JoyString.prototype.equals = function (other) {
  return this.value === other.value
}
JoyString.prototype.lte = function (other) {
  return this.equals(other) || this.value < other.value
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
JoyList.prototype.first = function () {
  return this.value[0]
}
JoyList.prototype.rest = function () {
  return this.map(x => x.slice(1))
}
JoyList.prototype.equals = function (other) {
  if (this.value.length !== other.value.length) { return false }
  return this.value.every((x, idx) =>
    x.equals
      ? x.equals(other.value[idx])
      : x.value === other.value[x].value)
}

function JoySet (value) {
  JoyBase.call(this, null)
  this._values = {}
  this._smallest = 32
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
JoySet.prototype.complement = function () {
  const result = new JoySet([])
  for (let i = 0; i < 32; i += 1) {
    const val = new JoyInt(i)
    if (!this.has(val)) {
      result.add(val)
    }
  }
  return result
}
JoySet.prototype.first = function () {
  return new JoyInt(this._smallest)
}
JoySet.prototype.rest = function () {
  const result = new JoySet([])
  this.forEach(x => {
    if (x.value !== this._smallest) {
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
JoySet.prototype.equals = function (other) {
  if (this.length !== other.length) { return false }
  let result = true
  this.forEach((val) => {
    result = result && other.has(val)
  })
  return result
}

function JoySymbol (value) {
  JoyBase.call(this, value)
  this.isSymbol = true
}
JoySymbol.prototype = Object.create(JoyBase.prototype)
JoySymbol.prototype.constructor = JoySymbol
JoySymbol.prototype.equals = function (other) {
  return this.value === other.value
}
JoySymbol.prototype.lte = function (other) {
  return this.equals(other) || this.value < other.value
}

module.exports = {
  JoyInt: JoyInt,
  JoyFloat: JoyFloat,
  JoyChar: JoyChar,
  JoyString: JoyString,
  JoyBool: JoyBool,
  JoyList: JoyList,
  JoySet: JoySet,
  JoySymbol: JoySymbol
}
