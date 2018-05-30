var Interpreter = require('./interpreter')
var Output = require('./output')
var Stack = require('./stack')

function Joy () {
  var joy = {
    output: '',
    stack: new Stack()
  }

  Output(joy)
  Interpreter(joy)

  return {
    run: function run (input) {
      return joy.run(input)
    }
  }
}

module.exports = Joy
