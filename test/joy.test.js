const test = require('tape')
const Joy = require('../src/joy/joy')

test('Joy examples', (t) => {
  const cases = [
    { input: '2 3 + .', expected: '5' },
    { input: '2.34 5.67 * .', expected: String(2.34 * 5.67) },
    { input: '2 3 + dup * .', expected: '25' },
    { input: '[1 2 3] [4 5 6 7] concat .', expected: '[1 2 3 4 5 6 7]' },
    { input: '[ 3.14  42  [1 2 3]  0.003 ]  dup  concat .', expected: '[3.14 42 [1 2 3] 0.003 3.14 42 [1 2 3] 0.003]' },
    { input: '[1 2 3 4]  [dup *]  map .', expected: '[1 4 9 16]' },
    { input: '5  [1]  [*]  primrec .', expected: '120' },
    { input: '20  3  4  +  *  6  -  100  rem .', expected: '34' },
    { input: '\'A  32  +  succ  succ .', expected: '\'c' },
    { input: 'false  true  false  not  and  not  or.', expected: 'false' },
    { input: '\'A  \'E  <  2  3  +  15  3  /  =  and.', expected: 'true' },
    { input: '{1 3 5 7}  {2 4 6 8}  or  {}  or  {3 4 5 6 7 8 9 10}  and.', expected: '{3 4 5 6 7 8}' },
    { input: '{3 7 5 1}  {2 4 6 8}  or  {}  or  {3 4 5 6 7 8 9 10 10} and.', expected: '{3 4 5 6 7 8}' },
    { input: '5  3 {2 1}  cons  cons  3  swap  cons.', expected: '{1 2 3 5}' },
    { input: '5  [6]  [1 2]  cons  cons  \'A  swap  cons.', expected: '[\'A 5 [6] 1 2]' },
    { input: '"CECAB"  first.', expected: '\'C' },
    { input: '[\'A 5 [6] 1 2]  first.', expected: '\'A' },
    { input: '[\'A 5 [6] 1 2]  rest.', expected: '[5 [6] 1 2]' },
    { input: '{5 2 3}  first.', expected: '2' },
    { input: '{5 2 3}  rest.', expected: '{3 5}' },
    { input: '[1 2 3 4 5] rest  rest  rest  rest  first.', expected: '5' },
    { input: '[1 2 3 4 5] 5 at.', expected: '5' },
    { input: '2000 [1000 >]  [2 /]  [3 *]  ifte .', expected: '1000' },
    { input: '[]  [2 8 3 6 5]  [swons]  step.', expected: '[5 6 3 8 2]' },
    { input: '"John Smith"   [\'Z >]   filter .', expected: '"ohnmith"' },
    { input: '[2 5 3]  0  [+]  fold .', expected: '10' },
    { input: '[2 5 3]  0  [dup * +]  fold .', expected: '38' },
    { input: '[3 4 5]    [0 [+] fold]   [size]   cleave   /.', expected: '4' }
  ]
  cases.forEach(({ input, expected }) => {
    t.equal(Joy().run(input), expected)
  })
  t.end()
})
