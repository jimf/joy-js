function fitToWidth (words, w) {
  return words.reduce((acc, word) => {
    if (acc.length === 0) { return word }
    const newlineIdx = acc.lastIndexOf('\n')
    const lineLength = newlineIdx === -1 ? acc.length : acc.length - newlineIdx - 1
    return (lineLength + word.length + 1 <= w)
      ? `${acc} ${word}`
      : `${acc}\n${word}`
  }, '')
}

module.exports = (opts) => [
  {
    name: 'help',
    signature: 'help      :  ->',
    help: `
Lists all defined symbols, including those from library files.
Then lists all primitives of raw Joy
(There is a variant: "_help" which lists hidden symbols).
`.trim(),
    handlers: [
      [[], function () {
        // NOTE: Not sure about proper ordering, or what definitions are considered primitive.
        const defs = opts.dictionary.keys()
        defs.reverse()
        opts.output(fitToWidth(defs, 72))
      }]
    ]
  },

  {
    name: 'helpdetail',
    signature: 'helpdetail      :  [ S1  S2  .. ]',
    help: 'Gives brief help on each symbol S in the list.',
    handlers: [
      [['List'], function (stack) {
        const top = stack.pop()
        top.value.forEach((word) => {
          let def
          try {
            def = opts.dictionary.get(word.value)
          } catch (e) {
            // TODO: Ignore for now. Not sure what Joy does here.
            return
          }
          if (def.signature && def.help) {
            opts.output(`${def.signature}\n  ${def.help}\n`)
          } else {
            // TODO: Handle == entries
          }
        })
      }]
    ]
  },

  /**
   * manual      :  ->
   * Writes this manual of all Joy primitives to output file.
   */

  {
    name: 'setautoput',
    signature: 'setautoput      :  I  ->',
    help: `
Sets value of flag for automatic put to I (if I = 0, none;
if I = 1, put; if I = 2, stack.
`.trim(),
    handlers: [
      [['Integer'], function (stack) {
        // NOTE: Not sure what should happen for out-of-range values.
        const top = stack.pop()
        opts.autoput(top.value)
      }]
    ]
  },

  {
    name: 'setundeferror',
    signature: 'setundeferror      :  I  ->',
    help: `
Sets flag that controls behavior of undefined functions
(0 = no error, 1 = error).
`.trim(),
    handlers: [
      [['Integer'], function (stack) {
        // NOTE: Not sure what should happen for out-of-range values.
        const top = stack.pop()
        opts.undefError(top.value)
      }]
    ]
  },

  {
    name: 'setecho',
    signature: 'setecho      :  I ->',
    help: `
Sets value of echo flag for listing.
I = 0: no echo, 1: echo, 2: with tab, 3: and linenumber.
`.trim(),
    handlers: [
      [['Integer'], function (stack) {
        // NOTE: Not sure what should happen for out-of-range values.
        const top = stack.pop()
        opts.echo(top.value)
      }]
    ]
  }

  /**
   * gc      :  ->
   * Initiates garbage collection.
   */

  /**
   * system      :  "command"  ->
   * Escapes to shell, executes string "command".
   * The string may cause execution of another program.
   * When that has finished, the process returns to Joy.
   */

  /**
   * getenv      :  "variable"  ->  "value"
   * Retrieves the value of the environment variable "variable".
   */

  /**
   * argv      :  -> A
   * Creates an aggregate A containing the interpreter's command line arguments.
   */

  /**
   * argc      :  -> I
   * Pushes the number of command line arguments. This is quivalent to 'argv size'.
   */

  /**
   * get      :  ->  F
   * Reads a factor from input and pushes it onto stack.
   */

  /**
   * put      :  X  ->
   * Writes X to output, pops X off stack.
   */

  /**
   * putch      :  N  ->
   * N : numeric, writes character whose ASCII is N.
   */

  /**
   * putchars      :  "abc.."  ->
   * Writes  abc.. (without quotes)
   */

  /**
   * include      :  "filnam.ext"  ->
   * Transfers input to file whose name is "filnam.ext".
   * On end-of-file returns to previous input file.
   */

  /**
   * abort      :  ->
   * Aborts execution of current Joy program, returns to Joy main cycle.
   */

  /**
   * quit      :  ->
   * Exit from Joy.
   */
]
