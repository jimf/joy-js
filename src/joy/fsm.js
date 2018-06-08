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
      return [pred, rule[1], rule[2]]
    })
    acc[s] = function (input, acc2) {
      var match = rules.find(function (rule) { return rule[0](input) })
      return match && [match[1], match[2] ? match[2](acc2, input) : acc2]
    }
    return acc
  }, {})

  function nextState (state, input, acc) {
    if (nextStates[state] === undefined) { return [opts.default, acc] }
    return nextStates[state](input, acc) || [opts.default, acc]
  }

  /**
   * Run characters of input against this fsm.
   *
   * @param {string} input Input string
   * @return {object|null} Result object if fsm reaches an accept state; null otherwise
   */
  function run (input) {
    let currState = opts.initial
    let state
    let result = ''
    let acc = opts.seed

    for (let i = 0, len = input.length; i < len; i += 1) {
      const c = input.charAt(i)
      const next = nextState(currState, c, acc)
      state = next[0]
      acc = next[1]
      if (state === opts.stop) { break }
      result += c
      currState = state
    }

    return opts.accepting.includes(currState)
      ? { value: result, state: currState, acc: acc }
      : null
  }

  return { run: run }
}

module.exports = Fsm
