const Lexer = require('./lexer')

function Parser () {
  let input
  let pos
  let tokens

  function formatUnexpectedToken () {
    let lineStart = input.lastIndexOf('\n', tokens[pos].pos)
    let lineEnd = input.indexOf('\n', tokens[pos].pos)
    if (lineStart === -1) {
      lineStart = 0
    } else {
      lineStart += 1 // Skip the newline
    }
    if (lineEnd === -1) { lineEnd = input.length - 1 }
    const line = input.slice(lineStart, lineEnd)
    const charsUpToError = tokens[pos].pos - lineStart
    const spacesToCaret = new Array(charsUpToError).fill(' ').join('')
    return `${line}\n${spacesToCaret}^`
  }

  function expect (bool, msg) {
    if (!bool) {
      msg = msg || `Syntax Error: Unexpected token "${tokens[pos].value}"\n\n${formatUnexpectedToken()}`
      throw new Error(msg)
    }
  }

  function match (type, value) {
    const token = tokens[pos]
    const result = Boolean(token) &&
      token.type === type &&
      (arguments.length === 1 || token.value === value) &&
      token
    if (result) {
      pos += 1
    }
    return result
  }

  function cycle () {
    const node = {
      type: 'Cycle',
      requests: []
    }

    while (true) {
      let next = compoundDefinition()
      if (next) {
        node.requests.push(next)
        continue
      }
      next = term()
      if (next && end()) {
        node.requests.push(next)
        continue
      }
      break
    }

    return node
  }

  function compoundDefinition () {
    let result = hideIn()
    if (result) { return result }
    const mod = match('ReservedWord', 'MODULE') && match('AtomicSymbol')
    const priv = match('ReservedWord', 'PRIVATE') && definitionSequence()
    const pub = (match('ReservedWord', 'PUBLIC') || match('ReservedWord', 'DEFINE') || match('ReservedWord', 'LIBRA')) && definitionSequence()
    if ((mod || priv || pub) && end()) {
      return {
        type: 'CompoundDefinition',
        module: mod,
        private: priv,
        public: pub
      }
    }
    return false
  }

  function hideIn () {
    if (match('ReservedWord', 'HIDE')) {
      const priv = definitionSequence()
      expect(priv && match('ReservedWord', 'IN'), 'IN expected in HIDE-definition')
      const pub = definitionSequence()
      expect(pub && match('ReservedWord', 'END'), 'END expected in HIDE-definition')
      return {
        type: 'CompoundDefinition',
        module: false,
        private: priv,
        public: pub
      }
    }
    return false
  }

  function definitionSequence () {
    const definitions = []
    let def = simpleDefinition()
    while (def) {
      definitions.push(def)
      def = match('ReservedChar', ';') && simpleDefinition()
    }
    if (definitions.length) {
      return {
        type: 'DefinitionSequence',
        definitions: definitions
      }
    }
    return false
  }

  function simpleDefinition () {
    const sym = match('AtomicSymbol')
    if (!(sym && match('ReservedWord', '=='))) { return false }
    const trm = term()
    return trm && {
      type: 'SimpleDefinition',
      symbol: sym,
      term: trm
    }
  }

  function term () {
    const node = {
      type: 'Term',
      factors: []
    }
    let child = factor()
    while (child) {
      node.factors.push(child)
      child = factor()
    }
    return node
  }

  function factor () {
    return match('AtomicSymbol') ||
      match('IntegerConstant') ||
      match('FloatConstant') ||
      match('CharacterConstant') ||
      match('StringConstant') ||
      set() ||
      quotation()
  }

  function set () {
    if (match('ReservedChar', '{')) {
      const members = []
      let member = match('CharacterConstant') || match('IntegerConstant')
      while (member) {
        members.push(member)
        member = match('CharacterConstant') || match('IntegerConstant')
      }
      if (match('ReservedChar', '}')) {
        return {
          type: 'Set',
          members: members
        }
      }
    }
    return false
  }

  function quotation () {
    if (match('ReservedChar', '[')) {
      const factors = term()
      if (factors && match('ReservedChar', ']')) {
        return {
          type: 'Quotation',
          term: factors
        }
      }
    }
    return false
  }

  function end () {
    return match('ReservedWord', 'END') || match('ReservedChar', '.')
  }

  return {
    parse: function parse (inp) {
      input = inp
      const lexer = Lexer(input)
      pos = 0
      tokens = lexer.tokenize()
      const ast = cycle()
      expect(pos === tokens.length)
      return ast
    }
  }
}

module.exports = Parser
