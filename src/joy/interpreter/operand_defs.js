const T = require('./types')

module.exports = opts => [
  {
    name: 'false',
    signature: 'false      :  ->  false',
    help: 'Pushes the value false.',
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyBool(false))
      }]
    ]
  },

  {
    name: 'true',
    signature: 'true      :  ->  true',
    help: 'Pushes the value true.',
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyBool(true))
      }]
    ]
  },

  {
    name: 'maxint',
    signature: 'maxint      :  ->  maxint',
    help: 'Pushes largest integer (platform dependent). Typically it is 32 bits.',
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyInt(Number.MAX_SAFE_INTEGER))
      }]
    ]
  },

  {
    name: 'setsize',
    signature: 'setsize      :  ->  setsize',
    help: `
Pushes the maximum number of elements in a set (platform dependent).
Typically it is 32, and set members are in the range 0..31.
`.trim(),
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyInt(32))
      }]
    ]
  },

  {
    name: 'stack',
    signature: 'stack      :  .. X Y Z  ->  .. X Y Z [Z Y X ..]',
    help: 'Pushes the stack as a list.',
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyList(stack.peek(stack.length)))
      }]
    ]
  },

  /**
   * conts      :  ->  [[P] [Q] ..]
   * Pushes current continuations. Buggy, do not use.
   */

  {
    name: 'autoput',
    signature: 'autoput      :  ->  I',
    help: 'Pushes current value of flag  for automatic output, I = 0..2.',
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyInt(opts.autoput()))
      }]
    ]
  },

  {
    name: 'undeferror',
    signature: 'undeferror      :  ->  I',
    help: 'Pushes current value of undefined-is-error flag.',
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyInt(opts.undefError()))
      }]
    ]
  },

  /**
   * undefs      :  ->
   * Push a list of all undefined symbols in the current symbol table.
   * TODO: Not sure what this is
   */

  {
    name: 'echo',
    signature: 'echo      :  ->  I',
    help: 'Pushes value of echo flag, I = 0..3.',
    handlers: [
      [[], function (stack) {
        stack.push(opts.echo())
      }]
    ]
  },

  /**
   * clock      :  ->  I
   * Pushes the integer value of current CPU usage in hundreds of a second.
   * TODO: Not sure what to do here
   */

  {
    name: 'time',
    signature: 'time      :  ->  I',
    help: 'Pushes the current time (in seconds since the Epoch).',
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyInt(Math.floor(Date.now() / 1000)))
      }]
    ]
  },

  {
    name: 'rand',
    signature: 'rand      :    -> I',
    help: 'I is a random integer.',
    handlers: [
      [[], function (stack) {
        stack.push(new T.JoyInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)))
      }]
    ]
  }

  /**
   * stdin      :  ->  S
   * Pushes the standard input stream.
   * TODO
   */

  /**
   * stdout      :  ->  S
   * Pushes the standard output stream.
   * TODO
   */

  /**
   * stderr      :  ->  S
   * Pushes the standard error stream.
   * TODO
   */
]
