var test = require('tape')
var Lexer = require('../src/joy/lexer')

var digits = '0123456789'.split('')
var lower = 'abcdefghijklmnopqrstuvwxyz'.split('')
var upper = lower.map(function (c) { return c.toUpperCase() })

function toNumber (input) {
  if (/^-?0\d+/.test(input)) {
    return parseInt(input, 8)
  } else if (/^-?0[xX]/.test(input)) {
    return parseInt(input, 16)
  }
  return Number(input)
}

test('Lexer skips whitespace', function (t) {
  t.deepEqual(Lexer('  \n  ').tokenize(), [])
  t.end()
})

test('Lexer skips comments', function (t) {
  t.deepEqual(Lexer('# comment').tokenize(), [])
  t.deepEqual(Lexer('(* comment *)').tokenize(), [])
  t.deepEqual(Lexer('(*\n*)').tokenize(), [])
  t.deepEqual(Lexer('(* multiline\n   comment *)').tokenize(), [])
  t.end()
})

test('Lexer recognizes reserved characters', function (t) {
  '[]{};.'.split('').forEach(function (c) {
    t.deepEqual(Lexer(c).tokenize(), [{ type: 'ReservedChar', rawValue: c, value: c }])
  })
  t.end()
})

test('Lexer recognizes integer constants', function (t) {
  var cases = digits
    .concat(digits.map(function (d) { return '-' + d }))
    .concat([
      '00000042',
      '1234567890',
      '9999999999',
      '-9999999999',
      '01234',
      '-077',
      '0312',
      '0xFF',
      '-0xCCFF',
      '0XABCDEF'
    ])
  cases.forEach(function (input) {
    t.deepEqual(Lexer(input).tokenize(), [{ type: 'IntegerConstant', rawValue: input, value: toNumber(input) }])
  })
  t.end()
})

test('Lexer recognizes float constants', function (t) {
  var cases = digits.map(function (d) { return d + '.0' })
    .concat(digits.map(function (d) { return '-' + d + '.0' }))
    .concat([
      '42.666',
      '1234567890.0123456789',
      '9999999999.999999999',
      '-9999999999.999999999',
      '1.0e10',
      '-5.5E9'
    ])
  cases.forEach(function (input) {
    t.deepEqual(Lexer(input).tokenize(), [{ type: 'FloatConstant', rawValue: input, value: toNumber(input) }])
  })
  t.end()
})

test('Lexer recognizes character constants', function (t) {
  var special = '!@#$%^&*();:.<>-_=+|[]{}'.split('')
  var cases = digits
    .concat(lower)
    .concat(upper)
    .concat(special)
    .map(function (testcase) { return "'" + testcase })
  cases.forEach(function (input) {
    t.deepEqual(Lexer(input).tokenize(), [{ type: 'CharacterConstant', rawValue: input, value: input.slice(1) }])
  })
  t.deepEqual(Lexer('\'\\n').tokenize(), [{ type: 'CharacterConstant', rawValue: '\'\\n', value: '\n' }])
  t.deepEqual(Lexer('\'\\t').tokenize(), [{ type: 'CharacterConstant', rawValue: '\'\\t', value: '\t' }])
  t.deepEqual(Lexer('\'\\b').tokenize(), [{ type: 'CharacterConstant', rawValue: '\'\\b', value: '\b' }])
  t.deepEqual(Lexer('\'\\r').tokenize(), [{ type: 'CharacterConstant', rawValue: '\'\\r', value: '\r' }])
  t.deepEqual(Lexer('\'\\f').tokenize(), [{ type: 'CharacterConstant', rawValue: '\'\\f', value: '\f' }])
  t.deepEqual(Lexer('\'\\\'').tokenize(), [{ type: 'CharacterConstant', rawValue: '\'\\\'', value: "'" }])
  t.deepEqual(Lexer('\'\\"').tokenize(), [{ type: 'CharacterConstant', rawValue: '\'\\"', value: '"' }])
  t.deepEqual(Lexer('\'\\042').tokenize(), [{ type: 'CharacterConstant', rawValue: '\'\\042', value: String.fromCharCode(34) }])
  t.end()
})

test('Lexer recognizes string constants', function (t) {
  var cases = [
    '""',
    '"hello world"',
    '"123"',
    '"\\n"',
    '"\\t"',
    '"\\b"',
    '"\\r"',
    '"\\f"',
    '"\\\'"',
    '"\\""',
    '"\\042"',
    '" "'
  ]
  cases.forEach(function (input) {
    t.deepEqual(Lexer(input).tokenize(), [{ type: 'StringConstant', rawValue: input, value: input }])
  })
  t.end()
})

test('Lexer recognizes reserved words', function (t) {
  ['MODULE', 'PRIVATE', 'HIDE', 'PUBLIC', 'IN', 'DEFINE', 'LIBRA', 'END'].forEach(function (input) {
    t.deepEqual(Lexer(input).tokenize(), [{ type: 'ReservedWord', rawValue: input, value: input }])
  })
  t.end()
})

test('Lexer recognizes atomic symbols', function (t) {
  var special = '!@$%^&*()-_+=\\|:<>,?/'.split('')
  var cases = lower
    .concat(upper)
    .concat(special)
    .concat([
      // '-12345678901', // NOTE: This one seems odd. Not qualified as integer due to >10 digits.
      // '#hi', // NOTE: Is this right? Or should this be a comment?
      'helloWorld123_-='
    ])
  cases.forEach(function (input) {
    t.deepEqual(Lexer(input).tokenize(), [{ type: 'AtomicSymbol', rawValue: input, value: input }])
  })
  t.deepEqual(Lexer('true').tokenize(), [{ type: 'AtomicSymbol', rawValue: 'true', value: true }])
  t.deepEqual(Lexer('false').tokenize(), [{ type: 'AtomicSymbol', rawValue: 'false', value: false }])
  t.end()
})

test('Lexer recognizes token sequences', function (t) {
  t.deepEqual(Lexer('[]').tokenize(), [
    { type: 'ReservedChar', rawValue: '[', value: '[' },
    { type: 'ReservedChar', rawValue: ']', value: ']' }
  ])
  t.deepEqual(Lexer('{}').tokenize(), [
    { type: 'ReservedChar', rawValue: '{', value: '{' },
    { type: 'ReservedChar', rawValue: '}', value: '}' }
  ])
  t.deepEqual(Lexer('{1 2}').tokenize(), [
    { type: 'ReservedChar', rawValue: '{', value: '{' },
    { type: 'IntegerConstant', rawValue: '1', value: 1 },
    { type: 'IntegerConstant', rawValue: '2', value: 2 },
    { type: 'ReservedChar', rawValue: '}', value: '}' }
  ])
  t.end()
})

test('Lexer throws tokenizing invalid input', function (t) {
  t.throws(Lexer('(*').tokenize, 'throws when multiline comment is not terminated')
  // t.throws(Lexer('1invalid').tokenize, 'throws when word is invalid') // Not throwing, but not getting parsed as an atom either. Not sure what is correct.
  // t.throws(Lexer('12345678901').tokenize, 'throws when integers exceed 10 digits')
  // t.throws(Lexer((Number.MAX_SAFE_INTEGER + 1).toString()).tokenize, 'throws when integers exceed platform max integer')
  t.throws(Lexer('"').tokenize, 'throws when string constant is not closed')
  t.throws(Lexer('"hello world').tokenize, 'throws when string constant is not closed')
  t.throws(Lexer('"hello\nworld"').tokenize, 'throws when string spans multiple lines')
  t.end()
})
