const Interpreter = require('./interpreter')
const Output = require('./output')
const Stack = require('./stack')

function Joy () {
  const flags = {
    /**
     * Automatic output behavior with each instruction.
     * 0: No automatic output
     * 1: (Default) Output top of stack
     * 2: Output entire stack
     */
    autoput: 1,

    /**
     * Input echoing behavior.
     * 0: (Default) No echo
     * 1: Echo input, no change
     * 2: Echo input, prefixed with tab
     * 3: Echo input, prefixed with line number, followed by tab
     */
    echo: 0,

    /**
     * How to treat undefined words.
     * 0: No error (noop)
     * 1: (Default) Error
     */
    undefinedIsError: 1
  }
  const stack = new Stack()
  const output = new Output()
  const getSetFlag = flag => (val) => {
    if (val === undefined) { return flags[flag] }
    flags[flag] = val
  }
  const interpreter = Interpreter(stack, {
    autoput: getSetFlag('autoput'),
    echo: getSetFlag('echo'),
    undefinedIsError: getSetFlag('undefinedIsError'),
    output: function (line) {
      output.write(line)
    }
  })

  return {
    run: function run (input) {
      output.clear()

      switch (flags.echo) {
        case 0: /* do nothing */ break
        case 1:
          output.write(`${input}\n`)
          break
        case 2:
          output.write(`\t${input}\n`)
          break
        case 3:
          // FIXME: should track line numbers
          output.write(`1.\t${input}\n`)
          break
      }

      interpreter.run(input)

      switch (flags.autoput) {
        case 0: /* do nothing */ break
        case 1:
          output.write(stack.peek(1).toString() + '\n')
          break
        case 2:
          stack.peek(stack.length).forEach((item) => {
            output.write(item.toString() + '\n')
          })
          break
      }

      return output.toString().replace(/\n$/, '')
    }
  }
}

module.exports = Joy
