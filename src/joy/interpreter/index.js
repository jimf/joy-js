var Dictionary = require('./dictionary')
var Lexer = require('../lexer')
var Parser = require('../parser')
var Stack = require('../stack')

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
      } else {
        definitions.get(token.rawValue)(stack)
      }
    }

    for (var pos = 0, len = instructions.length; pos < len; pos += 1) {
      token = instructions[pos]
      evalInstruction(token, stack)
    }

    return stack.toString()
  }

  joy.run = run

  return joy
}

module.exports = Interpreter
