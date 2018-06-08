const Dictionary = require('./dictionary')
const Parser = require('../parser')
const T = require('./types')

function tokenToType (token) {
  switch (token.type) {
    case 'IntegerConstant': return new T.JoyInt(token.value)
    case 'FloatConstant': return new T.JoyFloat(token.value)
    case 'CharacterConstant': return new T.JoyChar(token.value)
    case 'StringConstant': return new T.JoyString(token.value)
    case 'AtomicSymbol': return new T.JoySymbol(token.value)
    case 'Quotation':
      // if (token.term.factors.every(t => t.type && t.type.endsWith('Constant'))) {
      //   return new T.JoyList(token.term.factors.map(tokenToType))
      // }
      // break
      return new T.JoyList(token.term.factors.map(tokenToType))
    case 'Set': return new T.JoySet(token.members.map(tokenToType))
    case 'SimpleDefinition': return new T.JoyList(token.term.factors.map(tokenToType))
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

function Interpreter (stack, options) {
  const definitions = Dictionary.stdlib(
    Object.assign({ execute: execute }, options)
  )

  function evalBuiltin (def) {
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
      if (options.undefError() === 0) { return }
      throw new Error(`run time error: suitable parameters needed for ${def.name}`)
    }
    handler[1](stack)
  }

  function evalDefined (def) {
    def.definition.value.forEach((p) => {
      stack.push(p)
      execute()
    })
  }

  function evalInstruction (val) {
    if (val.isSymbol) {
      let def
      try {
        def = definitions.get(val.value)
      } catch (e) {
        if (options.undefError() === 0) { return }
        throw e
      }
      if (def.handlers) {
        evalBuiltin(def)
      } else {
        evalDefined(def)
      }
    } else {
      stack.push(val)
    }
  }

  function execute () {
    if (stack.length && stack.peek(1)[0].isSymbol) {
      const p = stack.pop()
      evalInstruction(p, stack)
    }
  }

  function run (input) {
    const ast = Parser().parse(input)

    ast.requests.forEach((instructions) => {
      if (instructions.type === 'CompoundDefinition') {
        (instructions.public.definitions || []).forEach((simpleDef) => {
          definitions.define(simpleDef.symbol.value, {
            name: simpleDef.symbol.value,
            definition: tokenToType(simpleDef)
          })
        })
      } else {
        instructions.factors.forEach((token) => {
          evalInstruction(tokenToType(token), stack)
        })
      }
    })
  }

  return { execute: execute, run: run }
}

module.exports = Interpreter
