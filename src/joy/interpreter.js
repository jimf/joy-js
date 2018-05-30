function Interpreter (joy) {
  function run (input) {
    return joy.output
  }

  joy.run = run

  return joy
}

module.exports = Interpreter
