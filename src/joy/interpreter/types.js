function JoyInt (value) {
  this.value = value
  this.isInteger = true
  this.isNumeric = true
}
JoyInt.from = function (other) {
  if (other.isFloat) {
    return new JoyInt(Math.floor(other.value))
  } else if (other.isCharacter) {
    return new JoyInt(other.value.charCodeAt(0))
  } else if (typeof other === 'number') {
    return new JoyInt(Math.floor(other))
  } else if (typeof other === 'string' && other.length === 1) {
    return new JoyInt(other.charCodeAt(0))
  }
  throw new Error('Cannot convert ' + other + ' to Integer')
}

function JoyFloat (value) {
  this.value = value
  this.isFloat = true
  this.isNumeric = true
}
JoyFloat.from = function (other) {
  if (other.isInteger) {
    return new JoyFloat(other.value)
  } else if (typeof other === 'number') {
    return new JoyFloat(other)
  }
  throw new Error('Cannot convert ' + other + ' to Float')
}

function JoyChar (value) {
  this.value = value
  this.isCharacter = true
  this.isNumeric = true
}
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

function JoyString (value) {
  this.value = value
  this.isString = true
}
JoyString.from = function (other) {
  if (other.isCharacter) {
    return new JoyString(other.value)
  }
  throw new Error('Cannot convert ' + other + ' to String')
}

function JoyBool (value) {
  this.value = value
  this.isBool = true
  this.isLogical = true
}

function JoyList (value) {
  this.value = value
  this.isList = true
}

function JoySet (value) {
  this.value = value
  this.isSet = true
}

module.exports = {
  JoyInt: JoyInt,
  JoyFloat: JoyFloat,
  JoyChar: JoyChar,
  JoyString: JoyString,
  JoyBool: JoyBool,
  JoyList: JoyList,
  JoySet: JoySet
}
