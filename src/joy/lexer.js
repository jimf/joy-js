var Fsm = require('./fsm')

function Token (type, rawValue, value) {
  this.type = type
  this.rawValue = rawValue
  this.value = arguments.length === 2 ? rawValue : value
}

var NumberFsm = Fsm({
  initial: 'Initial',
  stop: 'NoNextState',
  accepting: ['Integer', 'NumberZero', 'NumberWithDecimal', 'NumberWithExponent', 'OctalNumber', 'HexNumber'],
  default: 'NoNextState',
  states: {
    Initial: [
      ['0', 'NumberZero'],
      ['-', 'BeginNegativeNumber'],
      [/[0-9]/, 'Integer']
    ],
    Integer: [
      [/[0-9]/, 'Integer'],
      ['.', 'BeginNumberWithDecimal'],
      [/[eE]/, 'BeginNumberWithExponent']
    ],
    BeginNumberWithDecimal: [
      [/[0-9]/, 'NumberWithDecimal']
    ],
    NumberWithDecimal: [
      [/[0-9]/, 'NumberWithDecimal'],
      [/[eE]/, 'BeginNumberWithExponent']
    ],
    BeginNumberWithExponent: [
      ['-', 'BeginNumberWithSignedExponent'],
      [/[0-9]/, 'NumberWithExponent']
    ],
    BeginNumberWithSignedExponent: [
      [/[0-9]/, 'NumberWithExponent']
    ],
    NumberWithExponent: [
      [/[0-9]/, 'NumberWithExponent']
    ],
    NumberZero: [
      [/[0-7]/, 'OctalNumber'],
      [/[xX]/, 'BeginHexNumber'],
      ['.', 'BeginNumberWithDecimal']
    ],
    OctalNumber: [
      [/[0-7]/, 'OctalNumber']
    ],
    BeginHexNumber: [
      [/[0-9A-F]/, 'HexNumber']
    ],
    HexNumber: [
      [/[0-9A-F]/, 'HexNumber']
    ],
    BeginNegativeNumber: [
      ['0', 'NumberZero'],
      [/[1-9]/, 'Integer']
    ]
  }
})

var CharacterFsm = Fsm({
  initial: 'Initial',
  stop: 'NoNextState',
  accepting: ['Character', 'EscapedCharacter', 'CharacterEscapedAscii'],
  default: 'NoNextState',
  states: {
    Initial: [
      ["'", 'BeginCharacter']
    ],
    BeginCharacter: [
      [/[^\\]/, 'Character'],
      ['\\', 'BeginEscapedCharacter']
    ],
    BeginEscapedCharacter: [
      [/[ntbrf'"]/, 'EscapedCharacter'],
      [/\d/, 'BeginEscapedAscii0']
    ],
    BeginEscapedAscii0: [
      [/\d/, 'BeginEscapedAscii1']
    ],
    BeginEscapedAscii1: [
      [/\d/, 'CharacterEscapedAscii']
    ]
  }
})

var StringFsm = Fsm({
  initial: 'Initial',
  stop: 'NoNextState',
  accepting: ['String'],
  default: 'NoNextState',
  states: {
    Initial: [
      ['"', 'BeginString']
    ],
    'BeginString': [
      ['"', 'String'],
      ['\\', 'BeginStringEscape'],
      [/./, 'BeginString']
    ],
    'BeginStringEscape': [
      [/./, 'BeginString']
    ]
  }
})

function Lexer (input) {
  var pos = 0
  var lookahead = input.charAt(pos)
  var tokenMap = {
    '[': 'ReservedChar',
    ']': 'ReservedChar',
    '{': 'ReservedChar',
    '}': 'ReservedChar',
    ';': 'ReservedChar',
    '.': 'ReservedChar',
    '==': 'ReservedWord',
    'MODULE': 'ReservedWord',
    'PRIVATE': 'ReservedWord',
    'HIDE': 'ReservedWord',
    'PUBLIC': 'ReservedWord',
    'IN': 'ReservedWord',
    'DEFINE': 'ReservedWord',
    'LIBRA': 'ReservedWord',
    'END': 'ReservedWord'
  }

  function raiseParseError () {
    throw new Error('Parse error: Unexpected end of input')
  }

  function peek (n) {
    n = n || 1
    return input.slice(pos, pos + n)
  }

  function read (n) {
    n = n || 1
    var val = peek(n)
    if (val.length === n) {
      pos += n
      lookahead = input.charAt(pos)
      return val
    }
    raiseParseError()
  }

  function skipWhitespace () {
    while (lookahead === ' ' || lookahead === '\t' || lookahead === '\n') { read(1) }
  }

  function skipComment () {
    while (pos < input.length && lookahead !== '\n') { read(1) }
  }

  function skipCommentMultiline () {
    var endPos = input.indexOf('*)', pos)
    if (endPos === -1) { raiseParseError() }
    read((endPos + 2) - pos)
  }

  function recognizeNumber () {
    var result = NumberFsm.run(input.slice(pos))
    if (result === null) { return null }
    read(result.value.length)
    if (result.state === 'NumberWithDecimal' || result.state === 'NumberWithExponent') {
      return new Token('FloatConstant', result.value, parseFloat(result.value))
    } else if (result.state === 'OctalNumber') {
      return new Token('IntegerConstant', result.value, parseInt(result.value, 8))
    } else if (result.state === 'HexNumber') {
      return new Token('IntegerConstant', result.value, parseInt(result.value, 16))
    }
    return new Token('IntegerConstant', result.value, parseInt(result.value, 10))
  }

  function recognizeCharacter () {
    var result = CharacterFsm.run(input.slice(pos))
    if (result === null) { return null }
    read(result.value.length)
    // FIXME: value isn't correct for escaped strings or ascii codes
    return new Token('CharacterConstant', result.value, result.value.slice(1))
  }

  function recognizeString () {
    var result = StringFsm.run(input.slice(pos))
    if (result === null) { return null }
    read(result.value.length)
    return new Token('StringConstant', result.value)
  }

  function recognizeSymbol () {
    var currPos = pos
    var result
    if (/[a-zA-Z!@$%^&*()\-_+=\\|:<>,?/]/.test(lookahead)) {
      currPos += 1
      while (/[a-zA-Z0-9=_-]/.test(input.charAt(currPos))) {
        currPos += 1
      }
      result = read(currPos - pos)
      if (result === 'true') {
        return new Token('AtomicSymbol', 'true', true)
      } else if (result === 'false') {
        return new Token('AtomicSymbol', 'false', false)
      }
      return new Token(tokenMap[result] || 'AtomicSymbol', result)
    }
    return null
  }

  function nextToken () {
    var token
    skipWhitespace()
    switch (true) {
      case pos >= input.length:
        return null
      case tokenMap[lookahead] === 'ReservedChar':
        token = new Token('ReservedChar', lookahead)
        read(1)
        return token
      case lookahead === '#':
        skipComment()
        return nextToken()
      case peek(2) === '(*':
        skipCommentMultiline()
        return nextToken()
      case /[0-9]/.test(lookahead):
        return recognizeNumber() || raiseParseError()
      case lookahead === '-':
        return recognizeNumber() || recognizeSymbol() || raiseParseError()
      case lookahead === "'":
        return recognizeCharacter() || raiseParseError()
      case lookahead === '"':
        return recognizeString() || raiseParseError()
      default:
        return recognizeSymbol() || raiseParseError()
    }
  }

  return {
    tokenize: function tokenize () {
      var result = []
      var token = nextToken()
      while (token !== null) {
        result.push(token)
        token = nextToken()
      }
      return result
    }
  }
}

module.exports = Lexer
