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
    const ast = {
      type: 'Cycle',
      request: term()
    }
    match('ReservedWord', 'END') || match('ReservedChar', '.')
    expect(pos === tokens.length)
    return ast
  }

  // function compoundDefinition () {}

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
      return cycle()
    }
  }
}

module.exports = Parser
