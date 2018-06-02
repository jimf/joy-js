function Parser (lexer) {
  var pos = 0
  var tokens = lexer.tokenize()

  function expect (bool) {
    if (!bool) {
      throw new Error('Syntax Error: Unexpected token "' + tokens[pos].value + '"')
    }
  }

  function match (type, value) {
    var token = tokens[pos]
    var result = Boolean(token) &&
      token.type === type &&
      (arguments.length === 1 || token.value === value) &&
      token
    if (result) {
      pos += 1
    }
    return result
  }

  function cycle () {
    var ast = {
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
    var node = {
      type: 'Term',
      factors: []
    }
    var child = factor()
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
      quotation()
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
