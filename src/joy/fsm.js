/**
 * Construct a finite state machine for matching input string sequences.
 *
 * @param {object} opts Configuration options
 * @param {string} opts.initial Initial state
 * @param {string} [opts.default] Default state to transition to if next state is undefined
 * @param {string[]} opts.accepting Accept state(s)
 * @param {string} opts.stop State in which to stop accepting input
 * @return {object}
 */
function Fsm (opts) {
  var nextStates = Object.keys(opts.states).reduce(function (acc, s) {
    var rules = opts.states[s].map(function (rule) {
      if (!opts.states[rule[1]] && !opts.accepting.includes(rule[1])) {
        throw new Error('Programming Error: Transition defined for unknown state "' + rule[1] + '"')
      }
      var pred = rule[0].test
        ? function (c) { return rule[0].test(c) }
        : function (c) { return c === rule[0] }
      return [pred, rule[1]]
    })
    acc[s] = function (input) {
      var match = rules.find(function (rule) { return rule[0](input) })
      return match && match[1]
    }
    return acc
  }, {})

  function nextState (state, input) {
    var result = nextStates[state] && nextStates[state](input)
    if (result === undefined && opts.default) {
      result = opts.default
    }
    return result
  }

  /**
   * Run characters of input against this fsm.
   *
   * @param {string} input Input string
   * @return {object|null} Result object if fsm reaches an accept state; null otherwise
   */
  function run (input) {
    var currState = opts.initial
    var state
    var result = ''
    var c

    for (var i = 0, len = input.length; i < len; i += 1) {
      c = input.charAt(i)
      state = nextState(currState, c)
      if (state === opts.stop) { break }
      result += c
      currState = state
    }

    return opts.accepting.includes(currState)
      ? { value: result, state: currState }
      : null
  }

  return { run: run }
}

module.exports = Fsm
