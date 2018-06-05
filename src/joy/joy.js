var Interpreter = require('./interpreter')
var Stack = require('./stack')

function Joy () {
  const flags = {
    autoput: 1,
    echo: 0
  }
  const stack = new Stack()
  const interpreter = Interpreter(stack)

  return {
    run: function run (input) {
      let output = []

      switch (flags.echo) {
        case 0: /* do nothing */ break
        case 1:
          output.push(input)
          break
        case 2:
          output.push(`\t${input}`)
          break
        case 3:
          // FIXME: should track line numbers
          output.push(`1.\t${input}`)
          break
      }

      interpreter.run(input)

      switch (flags.autoput) {
        case 0: /* do nothing */ break
        case 1:
          output.push(stack.peek(1).toString())
          break
        case 2:
          output.concat(stack.peek(stack.length).map(x => x.toString()))
          break
      }

      return output.join('\n')
    }
  }
}

module.exports = Joy
