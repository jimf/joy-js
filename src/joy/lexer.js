var Fsm = require('./fsm')

const escapedCharToValue = {
  '\'\\n': '\n',
  '\'\\t': '\t',
  '\'\\b': '\b',
  '\'\\r': '\r',
  '\'\\f': '\f',
  "'\\'": "'",
  '\'\\"': '"'
}

function Token (type, rawValue, value, pos) {
  this.type = type
  this.rawValue = rawValue
  this.value = value == null ? rawValue : value
  this.pos = pos
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
  seed: '',
  states: {
    Initial: [
      ['"', 'BeginString']
    ],
    BeginString: [
      ['"', 'String'],
      ['\\', 'BeginStringEscape'],
      [/./, 'BeginString', (acc, s) => acc + s]
    ],
    BeginStringEscape: [
      [/[ntbrf'"]/, 'BeginString', (acc, s) => {
        switch (s) {
          case 'n': return acc + '\n'
          case 't': return acc + '\t'
          case 'b': return acc + '\b'
          case 'r': return acc + '\r'
          case 'f': return acc + '\f'
          case "'": return acc + "'"
          case '"': return acc + '"'
        }
      }],
      [/\d/, 'BeginStringEscapedAscii0', (acc, s) => acc + s]
    ],
    BeginStringEscapedAscii0: [
      [/\d/, 'BeginStringEscapedAscii1', (acc, s) => acc + s]
    ],
    BeginStringEscapedAscii1: [
      [/\d/, 'BeginString', (acc, s) => {
        const ascii = parseInt(acc.slice(-2) + s, 8)
        return acc.slice(0, -2) + String.fromCharCode(ascii)
      }]
    ]
  }
})

function Lexer (input) {
  let pos = 0
  let lookahead = input.charAt(pos)
  const tokenMap = {
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
    const val = peek(n)
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
    const endPos = input.indexOf('*)', pos)
    if (endPos === -1) { raiseParseError() }
    read((endPos + 2) - pos)
  }

  function recognizeNumber () {
    const currPos = pos
    const result = NumberFsm.run(input.slice(pos))
    if (result === null) { return null }
    read(result.value.length)
    if (result.state === 'NumberWithDecimal' || result.state === 'NumberWithExponent') {
      return new Token('FloatConstant', result.value, parseFloat(result.value), currPos)
    } else if (result.state === 'OctalNumber') {
      return new Token('IntegerConstant', result.value, parseInt(result.value, 8), currPos)
    } else if (result.state === 'HexNumber') {
      return new Token('IntegerConstant', result.value, parseInt(result.value, 16), currPos)
    }
    return new Token('IntegerConstant', result.value, parseInt(result.value, 10), currPos)
  }

  function recognizeCharacter () {
    const currPos = pos
    const result = CharacterFsm.run(input.slice(pos))
    if (result === null) { return null }
    read(result.value.length)
    let value
    if (result.state === 'Character') {
      value = result.value.charAt(1)
    } else if (result.state === 'EscapedCharacter') {
      value = escapedCharToValue[result.value]
    } else {
      const octal = parseInt(result.value.slice(2), 8)
      value = String.fromCharCode(octal)
    }
    return new Token('CharacterConstant', result.value, value, currPos)
  }

  function recognizeString () {
    const currPos = pos
    const result = StringFsm.run(input.slice(pos))
    if (result === null) { return null }
    read(result.value.length)
    return new Token('StringConstant', result.value, result.acc, currPos)
  }

  function recognizeSymbol () {
    const startPos = pos
    let currPos = pos
    let result
    if (/[a-zA-Z!@$%^&*()\-_+=\\|:<>,?/]/.test(lookahead)) {
      currPos += 1
      while (/[a-zA-Z0-9=_-]/.test(input.charAt(currPos))) {
        currPos += 1
      }
      result = read(currPos - pos)
      if (result === 'true') {
        return new Token('AtomicSymbol', 'true', true, startPos)
      } else if (result === 'false') {
        return new Token('AtomicSymbol', 'false', false, startPos)
      }
      return new Token(tokenMap[result] || 'AtomicSymbol', result, null, startPos)
    }
    return null
  }

  function nextToken () {
    let token
    skipWhitespace()
    const currPos = pos
    switch (true) {
      case pos >= input.length:
        return null
      case tokenMap[lookahead] === 'ReservedChar':
        token = new Token('ReservedChar', lookahead, null, currPos)
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
      const result = []
      let token = nextToken()
      while (token !== null) {
        result.push(token)
        token = nextToken()
      }
      return result
    }
  }
}

module.exports = Lexer
