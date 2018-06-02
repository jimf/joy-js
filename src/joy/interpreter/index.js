var Dictionary = require('./dictionary')
var Lexer = require('../lexer')
var Parser = require('../parser')
var Stack = require('../stack')

function stringify (obj) {
  if (Array.isArray(obj)) {
    return '[' + obj.map(stringify).join(' ') + ']'
  } else if (typeof obj === 'object' && obj.type && obj.value) {
    return obj.value.toString()
  } else if (obj === undefined) {
    return 'undefined'
  } else if (obj === null) {
    return 'null'
  }
  return obj.toString()
}

function Interpreter (joy) {
  function run (input) {
    var definitions = Dictionary.stdlib()
    var stack = new Stack()
    var ast = Parser(Lexer(input)).parse()
    var instructions = ast.request.factors
    var token

    function evalInstruction (token) {
      if (token.type.endsWith('Constant')) {
        stack.push(token.value)
      } else if (token.type === 'Quotation') {
        // Just handles lists for now
        stack.push(token.term.factors)
      } else {
        definitions.get(token.rawValue)(stack)
      }
    }

    for (var pos = 0, len = instructions.length; pos < len; pos += 1) {
      token = instructions[pos]
      evalInstruction(token, stack)
    }

    const top = stack.pop()
    stack.push(top)
    return stringify(top)
  }

  joy.run = run

  return joy
}

module.exports = Interpreter
