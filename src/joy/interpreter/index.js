const Dictionary = require('./dictionary')
const Lexer = require('../lexer')
const Parser = require('../parser')
const Stack = require('../stack')
const T = require('./types')

function tokenToType (token) {
  switch (token.type) {
    case 'IntegerConstant': return new T.JoyInt(token.value)
    case 'FloatConstant': return new T.JoyFloat(token.value)
    case 'CharacterConstant': return new T.JoyChar(token.value)
    case 'StringConstant': return new T.JoyString(token.value)
    case 'AtomicSymbol': return new T.JoySymbol(token.value)
    case 'Quotation':
      if (token.term.factors.every(t => t.type && t.type.endsWith('Constant'))) {
        return new T.JoyList(token.term.factors.map(tokenToType))
      }
      break
    default: /* do nothing */
  }
  throw new Error('Unhandled type conversion for token ' + token.type)
}

function arityToMessage (arity) {
  switch (arity) {
    case 1: return 'one parameter'
    case 2: return 'two parameters'
    case 3: return 'three parameters'
    case 4: return 'four parameters'
    case 5: return 'five parameters'
  }
}

function Interpreter (joy) {
  function run (input) {
    const definitions = Dictionary.stdlib()
    const stack = new Stack()
    const ast = Parser(Lexer(input)).parse()
    const instructions = ast.request.factors
    let token

    function evalInstruction (val) {
      if (val.isSymbol) {
        const def = definitions.get(val.value)
        const arity = def.handlers[0][0].length
        if (stack.length < arity) {
          throw new Error(`run time error: ${arityToMessage(arity)} needed for ${def.name}`)
        }
        const params = stack.peek(arity)
        const handler = def.handlers.find(handlerDef =>
          params.every((p, i) => {
            const paramType = handlerDef[0][i]
            return paramType === '*' || p[`is${paramType}`]
          }))
        if (!handler) {
          throw new Error(`run time error: suitable parameters needed for ${def.name}`)
        }
        handler[1](stack)
      } else {
        stack.push(val)
      }
    }

    for (let pos = 0, len = instructions.length; pos < len; pos += 1) {
      token = instructions[pos]
      evalInstruction(tokenToType(token), stack)
    }

    const top = stack.pop()
    stack.push(top)
    return top.toString()
  }

  joy.run = run

  return joy
}

module.exports = Interpreter
