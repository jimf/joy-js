const CombinatorDefs = require('./combinator_defs')
const OperatorDefs = require('./operator_defs')
const PredicateDefs = require('./predicate_defs')

function Dictionary () {
  const definitions = {}

  function define (key, value) {
    if (Object.prototype.hasOwnProperty.call(definitions, key)) {
      throw new Error('Word "' + key + '" already defined')
    }
    definitions[key] = value
  }

  function get (key) {
    if (!Object.prototype.hasOwnProperty.call(definitions, key)) {
      throw new Error('Word "' + key + '" is not defined')
    }
    return definitions[key]
  }

  return { define: define, get: get }
}

Dictionary.stdlib = function stdlib () {
  const dict = Dictionary()
  function load (defs) {
    Object.keys(defs).forEach(function (key) {
      dict.define(key, defs[key])
    })
  }
  load({
    'true': function (stack) { stack.push(true) },
    'false': function (stack) { stack.push(false) }
  })
  load(CombinatorDefs)
  load(OperatorDefs)
  load(PredicateDefs)
  return dict
}

module.exports = Dictionary
