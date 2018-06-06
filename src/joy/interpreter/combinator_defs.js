const T = require('./types')

function trampoline (fn) {
  return function () {
    let result = fn.apply(this, arguments)
    while (result instanceof Function) {
      result = result()
    }
    return result
  }
}

function dequote (stack, execute, quote) {
  quote = quote || stack.pop()
  quote.value.forEach((p) => {
    stack.push(p)
    execute()
  })
}

module.exports = execute => [
  {
    name: 'i',
    signature: 'i      :  [P]  ->  ...',
    help: 'Executes P. So, [P] i  ==  P.',
    handlers: [
      [['List'], function (stack) {
        dequote(stack, execute)
      }]
    ]
  },

  {
    name: 'x',
    signature: 'x      :  [P]i  ->  ...',
    help: 'Executes P without popping [P]. So, [P] x  ==  [P] P.',
    handlers: [
      [['List'], function (stack) {
        const P = stack.pop()
        stack.push(P)
        dequote(stack, execute, P)
      }]
    ]
  },

  {
    name: 'dip',
    signature: 'dip      :  X [P]  ->  ... X',
    help: 'Saves X, executes P, pushes X back.',
    handlers: [
      [['*', 'List'], function (stack) {
        const top = stack.pop()
        const bottom = stack.pop()
        stack.push(top)
        dequote(stack, execute)
        stack.push(bottom)
      }]
    ]
  },

  /**
   * app1      :  X [P]  ->  R
   * Executes P, pushes result R on stack without X.
   */

  /**
   * app11      :  X Y [P]  ->  R
   * Executes P, pushes result R on stack.
   */

  /**
   * app12      :  X Y1 Y2 [P]  ->  R1 R2
   * Executes P twice, with Y1 and Y2, returns R1 and R2.
   */

  /**
   * construct      :  [P] [[P1] [P2] ..]  ->  R1 R2 ..
   * Saves state of stack and then executes [P].
   * Then executes each [Pi] to give Ri pushed onto saved stack.
   */

  /**
   * nullary      :  [P]  ->  R
   * Executes P, which leaves R on top of the stack.
   * No matter how many parameters this consumes, none are removed from the stack.
   */

  /**
   * unary      :  X [P]  ->  R
   * Executes P, which leaves R on top of the stack.
   * No matter how many parameters this consumes,
   * exactly one is removed from the stack.
   */

  /**
   * unary2      :  X1 X2 [P]  ->  R1 R2
   * Executes P twice, with X1 and X2 on top of the stack.
   * Returns the two values R1 and R2.
   */

  /**
   * unary3      :  X1 X2 X3 [P]  ->  R1 R2 R3
   * Executes P three times, with Xi, returns Ri (i = 1..3).
   */

  /**
   * unary4      :  X1 X2 X3 X4 [P]  ->  R1 R2 R3 R4
   * Executes P four times, with Xi, returns Ri (i = 1..4).
   */

  /**
   * app2      :  X1 X2 [P]  ->  R1 R2
   * Obsolescent.  == unary2
   */

  /**
   * app3      :  X1 X2 X3 [P]  ->  R1 R2 R3
   * Obsolescent.  == unary3
   */

  /**
   * app4      :  X1 X2 X3 X4 [P]  ->  R1 R2 R3 R4
   * Obsolescent.  == unary4
   */

  /**
   * binary      :  X Y [P]  ->  R
   * Executes P, which leaves R on top of the stack.
   * No matter how many parameters this consumes,
   * exactly two are removed from the stack.
   */

  /**
   * ternary      :  X Y Z [P]  ->  R
   * Executes P, which leaves R on top of the stack.
   * No matter how many parameters this consumes,
   * exactly three are removed from the stack.
   */

  {
    name: 'cleave',
    signature: 'cleave      :  X [P1] [P2]  ->  R1 R2',
    help: 'Executes P1 and P2, each with X on top, producing two results.',
    handlers: [
      [['*', 'List', 'List'], function (stack) {
        const P2 = stack.pop()
        const P1 = stack.pop()
        const X = stack.pop()
        stack.push(X)
        dequote(stack, execute, P1)
        stack.push(X)
        dequote(stack, execute, P2)
      }]
    ]
  },

  {
    name: 'branch',
    signature: 'branch      :  B [T] [F]  ->  ...',
    help: 'If B is true, then executes T else executes F.',
    handlers: [
      [['Bool', 'List', 'List'], function (stack) {
        const F = stack.pop()
        const T = stack.pop()
        const B = stack.pop()
        if (B.value) {
          dequote(stack, execute, T)
        } else {
          dequote(stack, execute, F)
        }
      }]
    ]
  },

  {
    name: 'ifte',
    signature: 'ifte      :  [B] [T] [F]  ->  ...',
    help: 'Executes B. If that yields true, then executes T else executes F.',
    handlers: [
      [['List', 'List', 'List'], function (stack) {
        const F = stack.pop()
        const T = stack.pop()
        const B = stack.pop()
        const result = stack.restoreAfter(() => {
          dequote(stack, execute, B)
          return stack.pop().value
        })
        if (result) {
          dequote(stack, execute, T)
        } else {
          dequote(stack, execute, F)
        }
      }]
    ]
  },

  /**
   * ifinteger      :  X [T] [E]  ->  ...
   * If X is an integer, executes T else executes E.
   */

  /**
   * ifchar      :  X [T] [E]  ->  ...
   * If X is a character, executes T else executes E.
   */

  /**
   * iflogical      :  X [T] [E]  ->  ...
   * If X is a logical or truth value, executes T else executes E.
   */

  /**
   * ifset      :  X [T] [E]  ->  ...
   * If X is a set, executes T else executes E.
   */

  /**
   * ifstring      :  X [T] [E]  ->  ...
   * If X is a string, executes T else executes E.
   */

  /**
   * iflist      :  X [T] [E]  ->  ...
   * If X is a list, executes T else executes E.
   */

  /**
   * iffloat      :  X [T] [E]  ->  ...
   * If X is a float, executes T else executes E.
   */

  /**
   * iffile      :  X [T] [E]  ->  ...
   * If X is a file, executes T else executes E.
   */

  /**
   * cond      :  [..[[Bi] Ti]..[D]]  ->  ...
   * Tries each Bi. If that yields true, then executes Ti and exits.
   * If no Bi yields true, executes default D.
   */

  /**
   * while      :  [B] [D]  ->  ...
   * While executing B yields true executes D.
   */

  /**
   * linrec      :  [P] [T] [R1] [R2]  ->  ...
   * Executes P. If that yields true, executes T.
   * Else executes R1, recurses, executes R2.
   */

  /**
   * tailrec      :  [P] [T] [R1]  ->  ...
   * Executes P. If that yields true, executes T.
   * Else executes R1, recurses.
   */

  /**
   * binrec      :  [B] [T] [R1] [R2]  ->  ...
   * Executes P. If that yields true, executes T.
   * Else uses R1 to produce two intermediates, recurses on both,
   * then executes R2 to combines their results.
   */

  /**
   * genrec      :  [B] [T] [R1] [R2]  ->  ...
   * Executes B, if that yields true executes T.
   * Else executes R1 and then [[B] [T] [R1] [R2] genrec] R2.
   */

  /**
   * condlinrec      :  [ [C1] [C2] .. [D] ]  ->  ...
   * Each [Ci] is of the forms [[B] [T]] or [[B] [R1] [R2]].
   * Tries each B. If that yields true and there is just a [T], executes T and exit.
   * If there are [R1] and [R2], executes R1, recurses, executes R2.
   * Subsequent case are ignored. If no B yields true, then [D] is used.
   * It is then of the forms [[T]] or [[R1] [R2]]. For the former, executes T.
   * For the latter executes R1, recurses, executes R2.
   */

  /**
   * step      :  A  [P]  ->  ...
   * Sequentially putting members of aggregate A onto stack,
   * executes P for each member of A.
   */

  {
    name: 'fold',
    signature: 'fold      :  A V0 [P]  ->  V',
    help: `
Starting with value V0, sequentially pushes members of aggregate A
and combines with binary operator P to produce value V.
`.trim(),
    handlers: [
      [['List', '*', 'List'], function (stack) {
        const P = stack.pop()
        const seed = stack.pop()
        const A = stack.pop()
        stack.push(seed)
        A.value.forEach((val) => {
          stack.push(val)
          dequote(stack, execute, P)
        })
      }]
    ]
  },

  {
    name: 'map',
    signature: 'map      :  A [P]  ->  B',
    help: `
Executes P on each member of aggregate A,
collects results in sametype aggregate B.
`.trim(),
    handlers: [
      [['List', 'List'], function (stack) {
        const top = stack.pop()
        const bottom = stack.pop()
        const result = []
        bottom.value.forEach((item) => {
          stack.push(item)
          dequote(stack, execute, top)
          result.push(stack.pop())
        })
        stack.push(new T.JoyList(result))
      }]
      // TODO: Set, String
    ]
  },

  /**
   * times      :  N [P]  ->  ...
   * N times executes P.
   */

  /**
   * infra      :  L1 [P]  ->  L2
   * Using list L1 as stack, executes P and returns a new list L2.
   * The first element of L1 is used as the top of stack,
   * and after execution of P the top of stack becomes the first element of L2.
   */

  {
    name: 'primrec',
    signature: 'primrec      :  X [I] [C]  ->  R',
    help: `
Executes I to obtain an initial value R0.
For integer X uses increasing positive integers to X, combines by C for new R.
For aggregate X uses successive members and combines by C for new R.
`.trim(),
    handlers: [
      [['Integer', 'List', 'List'], function (stack) {
        const C = stack.pop()
        const I = stack.pop()

        const primrec = trampoline(function _primrec (n) {
          if (n === 0) {
            return I.value[0]
          }
          return function () {
            stack.push(new T.JoyInt(n))
            const res = _primrec(n - 1)
            stack.push(res instanceof Function ? res() : res)
            C.value.forEach((p) => {
              stack.push(p)
              execute()
            })
            return stack.pop()
          }
        })

        stack.push(primrec(stack.pop().value))
      }]
      // TODO: other aggregates
    ]
  }

  /**
   * filter      :  A [B]  ->  A1
   * Uses test B to filter aggregate A producing sametype aggregate A1.
   */

  /**
   * split      :  A [B]  ->  A1 A2
   * Uses test B to split aggregate A into sametype aggregates A1 and A2 .
   */

  /**
   * some      :  A  [B]  ->  X
   * Applies test B to members of aggregate A, X = true if some pass.
   */

  /**
   * all      :  A [B]  ->  X
   * Applies test B to members of aggregate A, X = true if all pass.
   */

  /**
   * treestep      :  T [P]  ->  ...
   * Recursively traverses leaves of tree T, executes P for each leaf.
   */

  /**
   * treerec      :  T [O] [C]  ->  ...
   * T is a tree. If T is a leaf, executes O. Else executes [[O] [C] treerec] C.
   */

  /**
   * treegenrec      :  T [O1] [O2] [C]  ->  ...
   * T is a tree. If T is a leaf, executes O1.
   * Else executes O2 and then [[O1] [O2] [C] treegenrec] C.
   */
]
