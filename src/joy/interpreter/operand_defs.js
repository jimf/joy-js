const T = require('./types')

module.exports = [
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
  }

  /**
   * maxint      :  ->  maxint
   * Pushes largest integer (platform dependent). Typically it is 32 bits.
   */

  /**
   * setsize      :  ->  setsize
   * Pushes the maximum number of elements in a set (platform dependent).
   * Typically it is 32, and set members are in the range 0..31.
   */

  /**
   * stack      :  .. X Y Z  ->  .. X Y Z [Z Y X ..]
   * Pushes the stack as a list.
   */

  /**
   * conts      :  ->  [[P] [Q] ..]
   * Pushes current continuations. Buggy, do not use.
   */

  /**
   * autoput      :  ->  I
   * Pushes current value of flag  for automatic output, I = 0..2.
   */

  /**
   * undeferror      :  ->  I
   * Pushes current value of undefined-is-error flag.
   */

  /**
   * undefs      :  ->
   * Push a list of all undefined symbols in the current symbol table.
   */

  /**
   * echo      :  ->  I
   * Pushes value of echo flag, I = 0..3.
   */

  /**
   * clock      :  ->  I
   * Pushes the integer value of current CPU usage in hundreds of a second.
   */

  /**
   * time      :  ->  I
   * Pushes the current time (in seconds since the Epoch).
   */

  /**
   * rand      :    -> I
   * I is a random integer.
   */

  /**
   * stdin      :  ->  S
   * Pushes the standard input stream.
   */

  /**
   * stdout      :  ->  S
   * Pushes the standard output stream.
   */

  /**
   * stderr      :  ->  S
   * Pushes the standard error stream.
   */
]
