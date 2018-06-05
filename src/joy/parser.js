function Parser (lexer) {
  let pos = 0
  let tokens = lexer.tokenize()

  function expect (bool) {
    if (!bool) {
      throw new Error('Syntax Error: Unexpected token "' + tokens[pos].value + '"')
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
      if (next && (match('ReservedWord', 'END') || match('ReservedChar', '.'))) {
        node.requests.push(next)
        continue
      }
      break
    }

    return node
  }

  function compoundDefinition () {
    return false
  }

  // function simpleDefinition () {}

  // function definitionSequence () {}

  // function literal () {}

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

  return {
    parse: function parse () {
      const ast = cycle()
      expect(pos === tokens.length)
      return ast
    }
  }
}

module.exports = Parser
