function JoyBase (value) {
  this.value = value
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
  Object.defineProperty(this, 'isNonEmptyAggregate', {
    get: () => this.value.length !== 0
  })
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
  Object.defineProperty(this, 'isNonEmptyAggregate', {
    get: () => this.value.length !== 0
  })
}
JoyQuotation.prototype = Object.create(JoyBase.prototype)
JoyQuotation.prototype.constructor = JoyQuotation
JoyQuotation.prototype.toString = function () {
  return `[${this.value.map(x => x.toString()).join(' ')}]`
}

function JoySet (value) {
  JoyBase.call(this, value)
  this.isSet = true
}
JoySet.prototype = Object.create(JoyBase.prototype)
JoySet.prototype.constructor = JoySet
JoySet.prototype.toString = function () {
  const entries = []
  this.value.forEach((x) => { entries.push(x) })
  return `[${entries.map(x => x.toString()).join(' ')}]`
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
