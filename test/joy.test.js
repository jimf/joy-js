const test = require('tape')
const Joy = require('../src/joy/joy')

test('Joy examples', (t) => {
  const cases = [
    { input: '2 3 + .', expected: '5' },
    { input: '2.34 5.67 * .', expected: String(2.34 * 5.67) },
    { input: '2 3 + dup * .', expected: '25' },
    { input: '[1 2 3] [4 5 6 7] concat .', expected: '[1 2 3 4 5 6 7]' }
  ]
  cases.forEach(({ input, expected }) => {
    t.equal(Joy().run(input), expected)
  })
  t.end()
})
