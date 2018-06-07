const { applyToTop, applyToTop2, applyToTop4, cmp } = require('./util')
const T = require('./types')

const map = f => x => x.map(f)
const liftA2 = f => (x, y) => x.map(f).ap(y)

const lpad = (s, w, c) => {
  let result = s
  while (result.length < w) {
    result = `${c || ' '}${result}`
  }
  return result
}

module.exports = [
  {
    name: 'id',
    signature: 'id      :  ->',
    help: 'Any program of the form  P id Q  is equivalent to just  P Q.',
    handlers: [[[], Function.prototype]]
  },

  {
    name: 'dup',
    signature: 'dup      :   X  ->   X X',
    help: 'Pushes an extra copy of X onto stack.',
    handlers: [
      [['*'], function (stack) {
        const top = stack.pop()
        stack.push(top)
        stack.push(top)
      }]
    ]
  },

  {
    name: 'swap',
    signature: 'swap      :   X Y  ->   Y X',
    help: 'Interchanges X and Y on top of the stack.',
    handlers: [
      [['*', '*'], function (stack) {
        const top = stack.pop()
        const bottom = stack.pop()
        stack.push(top)
        stack.push(bottom)
      }]
    ]
  },

  {
    name: 'rollup',
    signature: 'rollup      :  X Y Z  ->  Z X Y',
    help: 'Moves X and Y up, moves Z down',
    handlers: [
      [['*', '*', '*'], function (stack) {
        const top = stack.pop()
        const middle = stack.pop()
        const bottom = stack.pop()
        stack.push(top)
        stack.push(bottom)
        stack.push(middle)
      }]
    ]
  },

  {
    name: 'rolldown',
    signature: 'rolldown      :  X Y Z  ->  Y Z X',
    help: 'Moves Y and Z down, moves X up',
    handlers: [
      [['*', '*', '*'], function (stack) {
        const top = stack.pop()
        const middle = stack.pop()
        const bottom = stack.pop()
        stack.push(middle)
        stack.push(top)
        stack.push(bottom)
      }]
    ]
  },

  {
    name: 'rotate',
    signature: 'rotate      :  X Y Z  ->  Z Y X',
    help: 'Interchanges X and Z',
    handlers: [
      [['*', '*', '*'], function (stack) {
        const top = stack.pop()
        const middle = stack.pop()
        const bottom = stack.pop()
        stack.push(top)
        stack.push(middle)
        stack.push(bottom)
      }]
    ]
  },

  {
    name: 'popd',
    signature: 'popd      :  Y Z  ->  Z',
    help: 'As if defined by:   popd  ==  [pop] dip',
    handlers: [
      [['*', '*'], function (stack) {
        const top = stack.pop()
        stack.pop()
        stack.push(top)
      }]
    ]
  },

  {
    name: 'dupd',
    signature: 'dupd      :  Y Z  ->  Y Y Z',
    help: 'As if defined by:   dupd  ==  [dup] dip',
    handlers: [
      [['*', '*'], function (stack) {
        const top = stack.pop()
        const bottom = stack.pop()
        stack.push(bottom)
        stack.push(bottom)
        stack.push(top)
      }]
    ]
  },

  {
    name: 'swapd',
    signature: 'swapd      :  X Y Z  ->  Y X Z',
    help: 'As if defined by:   swapd  ==  [swap] dip',
    handlers: [
      [['*', '*', '*'], function (stack) {
        const top = stack.pop()
        const middle = stack.pop()
        const bottom = stack.pop()
        stack.push(middle)
        stack.push(bottom)
        stack.push(top)
      }]
    ]
  },

  {
    name: 'rollupd',
    signature: 'rollupd      :  X Y Z W  ->  Z X Y W',
    help: 'As if defined by:   rollupd  ==  [rollup] dip',
    handlers: [
      [['*', '*', '*', '*'], function (stack) {
        const top = stack.pop()
        const middleTop = stack.pop()
        const middleBot = stack.pop()
        const bottom = stack.pop()
        stack.push(middleTop)
        stack.push(bottom)
        stack.push(middleBot)
        stack.push(top)
      }]
    ]
  },

  {
    name: 'rolldownd',
    signature: 'rolldownd      :  X Y Z W  ->  Y Z X W',
    help: 'As if defined by:   rolldownd  ==  [rolldown] dip',
    handlers: [
      [['*', '*', '*', '*'], function (stack) {
        const top = stack.pop()
        const middleTop = stack.pop()
        const middleBot = stack.pop()
        const bottom = stack.pop()
        stack.push(middleBot)
        stack.push(middleTop)
        stack.push(bottom)
        stack.push(top)
      }]
    ]
  },

  {
    name: 'rotated',
    signature: 'rotated      :  X Y Z W  ->  Z Y X W',
    help: 'As if defined by:   rotated  ==  [rotate] dip',
    handlers: [
      [['*', '*', '*', '*'], function (stack) {
        const top = stack.pop()
        const middleTop = stack.pop()
        const middleBot = stack.pop()
        const bottom = stack.pop()
        stack.push(middleTop)
        stack.push(middleBot)
        stack.push(bottom)
        stack.push(top)
      }]
    ]
  },

  {
    name: 'pop',
    signature: 'pop      :   X  ->',
    help: 'Removes X from top of the stack.',
    handlers: [
      [['*'], function (stack) {
        stack.pop()
      }]
    ]
  },

  {
    name: 'choice',
    signature: 'choice      :  B T F  ->  X',
    help: 'If B is true, then X = T else X = F.',
    handlers: [
      [['Bool', '*', '*'], function (stack) {
        const top = stack.pop()
        const middle = stack.pop()
        const bottom = stack.pop()
        stack.push(bottom === true ? middle : top)
      }]
    ]
  },

  {
    name: 'or',
    signature: 'or      :  X Y  ->  Z',
    help: 'Z is the union of sets X and Y, logical disjunction for truth values.',
    handlers: [
      [['Bool', 'Bool'], applyToTop2(liftA2(x => y => x || y))],
      [['Set', 'Set'], applyToTop2((x, y) => x.union(y))]
    ]
  },

  {
    name: 'xor',
    signature: 'xor      :  X Y  ->  Z',
    help: `
Z is the symmetric difference of sets X and Y,
logical exclusive disjunction for truth values.
`.trim(),
    handlers: [
      [['Bool', 'Bool'], applyToTop2(liftA2(x => y => (x || y) && !(x && y)))],
      [['Set', 'Set'], applyToTop2((x, y) => x.symmetricDifference(y))]
    ]
  },

  {
    name: 'and',
    signature: 'and      :  X Y  ->  Z',
    help: 'Z is the intersection of sets X and Y, logical conjunction for truth values.',
    handlers: [
      [['Bool', 'Bool'], applyToTop2(liftA2(x => y => x && y))],
      [['Set', 'Set'], applyToTop2((x, y) => x.intersect(y))]
    ]
  },

  {
    name: 'not',
    signature: 'not      :  X  ->  Y',
    help: 'Y is the complement of set X, logical negation for truth values.',
    handlers: [
      [['Bool'], applyToTop(map(x => !x))],
      [['Set'], applyToTop(x => x.complement())]
    ]
  },

  {
    name: '+',
    signature: '+      :  M I  ->  N',
    help: `
Numeric N is the result of adding integer I to numeric M.
Also supports float.
`.trim(),
    handlers: [
      [['Numeric', 'Numeric'], applyToTop2((x, y) => {
        if (x.isCharacter || y.isCharacter) {
          return T.JoyChar.from(x.toNumber() + y.toNumber())
        }
        return new T.JoyInt(x.value + y.value)
      })],
      [['Float', 'Float'], applyToTop2(liftA2(x => y => x + y))]
    ]
  },

  {
    name: '-',
    signature: '-      :  M I  ->  N',
    help: `
Numeric N is the result of subtracting integer I from numeric M.
Also supports float.
`.trim(),
    handlers: [
      [['Numeric', 'Numeric'], applyToTop2((x, y) => {
        if (x.isCharacter || y.isCharacter) {
          return T.JoyChar.from(x.toNumber() - y.toNumber())
        }
        return new T.JoyInt(x.value - y.value)
      })],
      [['Float', 'Float'], applyToTop2(liftA2(x => y => x - y))]
    ]
  },

  {
    name: '*',
    signature: '*      :  I J  ->  K',
    help: 'Integer K is the product of integers I and J.  Also supports float.',
    handlers: [
      [['Integer', 'Integer'], applyToTop2(liftA2(x => y => x * y))],
      [['Float', 'Float'], applyToTop2(liftA2(x => y => x * y))]
    ]
  },

  {
    name: '/',
    signature: '/      :  I J  ->  K',
    help: 'Integer K is the (rounded) ratio of integers I and J.  Also supports float.',
    handlers: [
      [['Integer', 'Integer'], applyToTop2(liftA2(x => y => x / y))],
      [['Float', 'Float'], applyToTop2(liftA2(x => y => x / y))]
    ]
  },

  {
    name: 'rem',
    signature: 'rem      :  I J  ->  K',
    help: 'Integer K is the remainder of dividing I by J.  Also supports float.',
    handlers: [
      [['Integer', 'Integer'], applyToTop2(liftA2(x => y => x % y))],
      [['Float', 'Float'], applyToTop2(liftA2(x => y => x % y))] // Should this return Int?
    ]
  },

  {
    name: 'div',
    signature: 'div      :  I J  ->  K L',
    help: 'Integers K and L are the quotient and remainder of dividing I by J.',
    handlers: [
      [['Integer', 'Integer'], function (stack) {
        const top = stack.pop()
        const bottom = stack.pop()
        stack.push(top.map(() => Math.floor(bottom / top)))
        stack.push(top.map(() => Math.floor(bottom % top)))
      }]
    ]
  },

  {
    name: 'sign',
    signature: 'sign      :  N1  ->  N2',
    help: `
Integer N2 is the sign (-1 or 0 or +1) of integer N1,
or float N2 is the sign (-1.0 or 0.0 or 1.0) of float N1.
`.trim(),
    handlers: [
      [['Integer'], applyToTop(map(x => {
        if (x === 0) { return 0 }
        return x < 0 ? -1 : 1
      }))],
      [['Float'], applyToTop(map(x => {
        if (x === 0) { return 0 }
        return x < 0 ? -1 : 1
      }))]
    ]
  },

  {
    name: 'neg',
    signature: 'neg      :  I  ->  J',
    help: 'Integer J is the negative of integer I.  Also supports float.',
    handlers: [
      [['Integer'], applyToTop(map(x => -x))],
      [['Float'], applyToTop(map(x => -x))]
    ]
  },

  {
    name: 'abs',
    signature: 'abs      :  N1  ->  N2',
    help: `
Integer N2 is the absolute value (0,1,2..) of integer N1,
or float N2 is the absolute value (0.0 ..) of float N1
`.trim(),
    handlers: [
      [['Integer'], applyToTop(map(Math.abs))],
      [['Float'], applyToTop(map(Math.abs))]
    ]
  },

  {
    name: 'acos',
    signature: 'acos      :  F  ->  G',
    help: 'G is the arc cosine of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.acos))]
    ]
  },

  {
    name: 'asin',
    signature: 'asin      :  F  ->  G',
    help: 'G is the arc sine of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.asin))]
    ]
  },

  {
    name: 'atan',
    signature: 'atan      :  F  ->  G',
    help: 'G is the arc tangent of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.atan))]
    ]
  },

  {
    name: 'atan2',
    signature: 'atan2      :  F G  ->  H',
    help: 'H is the arc tangent of F / G.',
    handlers: [
      [['Float', 'Float'], applyToTop2(liftA2(x => y => Math.atan(x / y)))]
    ]
  },

  {
    name: 'ceil',
    signature: 'ceil      :  F  ->  G',
    help: 'G is the float ceiling of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.ceil))]
    ]
  },

  {
    name: 'cos',
    signature: 'cos      :  F  ->  G',
    help: 'G is the cosine of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.cos))]
    ]
  },

  {
    name: 'cosh',
    signature: 'cosh      :  F  ->  G',
    help: 'G is the hyperbolic cosine of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.cosh))]
    ]
  },

  {
    name: 'exp',
    signature: 'exp      :  F  ->  G',
    help: 'G is e (2.718281828...) raised to the Fth power.',
    handlers: [
      [['Integer'], applyToTop(x => T.JoyFloat.from(x).map(Math.exp))]
    ]
  },

  {
    name: 'floor',
    signature: 'floor      :  F  ->  G',
    help: 'G is the floor of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.floor))]
    ]
  },

  /**
   * frexp      :  F  ->  G I
   * G is the mantissa and I is the exponent of F.
   * Unless F = 0, 0.5 <= abs(G) < 1.0.
   * TODO (not easy in JS)
   */

  {
    name: 'ldexp',
    signature: 'ldexp      :  F I  -> G',
    help: 'G is F times 2 to the Ith power.',
    handlers: [
      [['Float', 'Integer'], applyToTop2((F, I) =>
        new T.JoyFloat(x => y => x * y)
          .ap(F)
          .ap(T.JoyFloat.from(I.map(x => Math.pow(2, x)))))]
    ]
  },

  {
    name: 'log',
    signature: 'log      :  F  ->  G',
    help: 'G is the natural logarithm of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.log))]
    ]
  },

  {
    name: 'log10',
    signature: 'log10      :  F  ->  G',
    help: 'G is the common logarithm of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.log10))]
    ]
  },

  {
    name: 'modf',
    signature: 'modf      :  F  ->  G H',
    help: `
G is the fractional part and H is the integer part
(but expressed as a float) of F.
`.trim(),
    handlers: [
      [['Float'], function (stack) {
        const top = stack.pop()
        const intPart = top.map(Math.floor)
        stack.push(new T.JoyFloat(x => y => x % y).ap(top).ap(intPart))
        stack.push(intPart)
      }]
    ]
  },

  {
    name: 'pow',
    signature: 'pow      :  F G  ->  H',
    help: 'H is F raised to the Gth power.',
    handlers: [
      [['Float', 'Integer'], applyToTop2((F, G) =>
        new T.JoyFloat(x => y => Math.pow(x, y))
          .ap(F)
          .ap(T.JoyFloat.from(G)))]
    ]
  },

  {
    name: 'sin',
    signature: 'sin      :  F  ->  G',
    help: 'G is the sine of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.sin))]
    ]
  },

  {
    name: 'sinh',
    signature: 'sinh      :  F  ->  G',
    help: 'G is the hyperbolic sine of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.sinh))]
    ]
  },

  {
    name: 'sqrt',
    signature: 'sqrt      :  F  ->  G',
    help: 'G is the square root of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.sqrt))]
    ]
  },

  {
    name: 'tan',
    signature: 'tan      :  F  ->  G',
    help: 'G is the tangent of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.tan))]
    ]
  },

  {
    name: 'tanh',
    signature: 'tanh      :  F  ->  G',
    help: 'G is the hyperbolic tangent of F.',
    handlers: [
      [['Float'], applyToTop(map(Math.tanh))]
    ]
  },

  {
    name: 'trunc',
    signature: 'trunc      :  F  ->  I',
    help: 'I is an integer equal to the float F truncated toward zero.',
    handlers: [
      [['Float'], applyToTop(T.JoyInt.from)]
    ]
  },

  {
    name: 'localtime',
    signature: 'localtime      :  I  ->  T',
    help: `
Converts a time I into a list T representing local time:
[year month day hour minute second isdst yearday weekday].
Month is 1 = January ... 12 = December;
isdst is a Boolean flagging daylight savings/summer time;
weekday is 0 = Monday ... 7 = Sunday.
`.trim(),
    handlers: [
      [['Integer'], applyToTop(x => {
        const d = new Date(x.value * 1000)
        const jan = new Date(d.getFullYear(), 0, 1)
        const jul = new Date(d.getFullYear(), 6, 1)
        const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
        const day = d.getDay()
        return new T.JoyList([
          new T.JoyInt(d.getFullYear()),
          new T.JoyInt(d.getMonth() + 1),
          new T.JoyInt(d.getDate()),
          new T.JoyInt(d.getHours()),
          new T.JoyInt(d.getMinutes()),
          new T.JoyInt(d.getSeconds()),
          new T.JoyBool(d.getTimezoneOffset() < stdOffset),
          new T.JoyInt(d.getYear()),
          new T.JoyInt(day === 0 ? 6 : day - 1)
        ])
      })]
    ]
  },

  {
    name: 'gmtime',
    signature: 'gmtime      :  I  ->  T',
    help: `
Converts a time I into a list T representing universal time:
[year month day hour minute second isdst yearday weekday].
Month is 1 = January ... 12 = December;
isdst is false; weekday is 0 = Monday ... 7 = Sunday.
`.trim(),
    handlers: [
      [['Integer'], applyToTop(x => {
        const d = new Date(x.value * 1000)
        const jan = new Date(d.getUTCFullYear(), 0, 1)
        const jul = new Date(d.getUTCFullYear(), 6, 1)
        const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
        const day = d.getUTCDay()
        return new T.JoyList([
          new T.JoyInt(d.getUTCFullYear()),
          new T.JoyInt(d.getUTCMonth() + 1),
          new T.JoyInt(d.getUTCDate()),
          new T.JoyInt(d.getUTCHours()),
          new T.JoyInt(d.getUTCMinutes()),
          new T.JoyInt(d.getUTCSeconds()),
          new T.JoyBool(d.getTimezoneOffset() < stdOffset),
          new T.JoyInt(d.getYear()),
          new T.JoyInt(day === 0 ? 6 : day - 1)
        ])
      })]
    ]
  },

  {
    name: 'mktime',
    signature: 'mktime      :  T  ->  I',
    help: `
Converts a list T representing local time into a time I.
T is in the format generated by localtime.
`.trim(),
    handlers: [
      [['List'], applyToTop(x => {
        const vals = x.value.map(y => y.value)
        const d = new Date(vals[0], vals[1] - 1, vals[2], vals[3], vals[4], vals[5])
        return new T.JoyInt(d.getTime() / 1000)
      })]
    ]
  },

  /**
   * strftime      :  T S1  ->  S2
   * Formats a list T in the format of localtime or gmtime
   * using string S1 and pushes the result S2.
   * TODO
   */

  {
    name: 'strtol',
    signature: 'strtol      :  S I  ->  J',
    help: `
String S is converted to the integer J using base I.
If I = 0, assumes base 10,
but leading "0" means base 8 and leading "0x" means base 16.
`.trim(),
    handlers: [
      [['String', 'Integer'], applyToTop2((S, I) => {
        let base = I.value === 0 ? 10 : I.value
        if (S.value.startsWith('0') && S.value !== '0') {
          base = 8
        } else if (S.value.startsWith('0x') || S.value.startsWith('0X')) {
          base = 16
        }
        return T.JoyInt(parseInt(S.value, base))
      })]
    ]
  },

  {
    name: 'strtod',
    signature: 'strtod      :  S  ->  R',
    help: 'String S is converted to the float R.',
    handlers: [
      [['String'], applyToTop(T.JoyFloat.from)]
    ]
  },

  {
    name: 'format',
    signature: 'format      :  N C I J  ->  S',
    help: `
S is the formatted version of N in mode C
('d or 'i = decimal, 'o = octal, 'x or
'X = hex with lower or upper case letters)
with maximum width I and minimum width J.
`.trim(),
    handlers: [
      [['Integer', 'Character', 'Integer', 'Integer'], applyToTop4((N, C, I, J) => {
        // TODO: Still some todos. Joy uses sprintf under the hood, which is
        // non-trivial. Also, should this work for characters?
        if (!/[dioxX]/.test(C.value)) {
          throw new Error('run time error: one of: d i o x X needed for format')
        }
        if (/[oxX]/.test(C.value)) {
          throw new Error(`run time error: ${C.value} not yet implemented for format`)
        }
        if (J.value === 0 && N.value === 0) { return '' }
        // Not sure if max width is being handled correctly.
        return new T.JoyString(lpad(N.value.toString(), J.value, '0').slice(0, I.value))
      })]
    ]
  },

  {
    name: 'formatf',
    signature: 'formatf      :  F C I J  ->  S',
    help: `
S is the formatted version of F in mode C
('e or 'E = exponential, 'f = fractional,
'g or G = general with lower or upper case letters)
with maximum width I and precision J.
`.trim(),
    handlers: [
      [['Float', 'Character', 'Integer', 'Integer'], applyToTop4((F, C, I, J) => {
        // TODO: Still some todos. Joy uses sprintf under the hood, which is
        // non-trivial.
        if (!/[eEfgG]/.test(C.value)) {
          throw new Error('run time error: one of: e E f g G needed for format')
        }
        // TODO: Do something with C
        if (J.value === 0 && F.value === 0) { return '' }
        // Not sure if max width is being handled correctly.
        return new T.JoyString(F.value.toFixed(J.value).slice(0, I.value))
      })]
    ]
  },

  /**
   * srand      :  I  ->
   * Sets the random integer seed to integer I.
   * TODO: JavaScript does not expose the seed for its rng. May need to revisit if this is needed.
   */

  {
    name: 'pred',
    signature: 'pred      :  M  ->  N',
    help: 'Numeric N is the predecessor of numeric M.',
    handlers: [
      [['Numeric'], applyToTop(x => x.constructor.from(x.toNumber() - 1))]
    ]
  },

  {
    name: 'succ',
    signature: 'succ      :  M  ->  N',
    help: 'Numeric N is the successor of numeric M.',
    handlers: [
      [['Numeric'], applyToTop(x => x.constructor.from(x.toNumber() + 1))]
    ]
  },

  {
    name: 'max',
    signature: 'max      :  N1 N2  ->  N',
    help: 'N is the maximum of numeric values N1 and N2.  Also supports float.',
    handlers: [
      [['Character', 'Character'], applyToTop2(liftA2(x => y => x >= y ? x : y))],
      [['Integer', 'Integer'], applyToTop2(liftA2(x => y => Math.max(x, y)))],
      [['Float', 'Float'], applyToTop2(liftA2(x => y => Math.max(x, y)))]
    ]
  },

  {
    name: 'min',
    signature: 'min      :  N1 N2  ->  N',
    help: 'N is the minimum of numeric values N1 and N2.  Also supports float.',
    handlers: [
      [['Character', 'Character'], applyToTop2((N1, N2) => new T.JoyChar(x => y => x <= y ? x : y).ap(N1).ap(N2))],
      [['Integer', 'Integer'], applyToTop2(liftA2(x => y => Math.min(x, y)))],
      [['Float', 'Float'], applyToTop2(liftA2(x => y => Math.min(x, y)))]
    ]
  },

  /**
   * fclose      :  S  ->
   * Stream S is closed and removed from the stack.
   */

  /**
   * feof      :  S  ->  S B
   * B is the end-of-file status of stream S.
   */

  /**
   * ferror      :  S  ->  S B
   * B is the error status of stream S.
   */

  /**
   * fflush      :  S  ->  S
   * Flush stream S, forcing all buffered output to be written.
   */

  /**
   * fgetch      :  S  ->  S C
   * C is the next available character from stream S.
   */

  /**
   * fgets      :  S  ->  S L
   * L is the next available line (as a string) from stream S.
   */

  /**
   * fopen      :  P M  ->  S
   * The file system object with pathname P is opened with mode M (r, w, a, etc.)
   * and stream object S is pushed; if the open fails, file:NULL is pushed.
   */

  /**
   * fread      :  S I  ->  S L
   * I bytes are read from the current position of stream S
   * and returned as a list of I integers.
   */

  /**
   * fwrite      :  S L  ->  S
   * A list of integers are written as bytes to the current position of stream S.
   */

  /**
   * fremove      :  P  ->  B
   * The file system object with pathname P is removed from the file system.
   *  is a boolean indicating success or failure.
   */

  /**
   * frename      :  P1 P2  ->  B
   * The file system object with pathname P1 is renamed to P2.
   * B is a boolean indicating success or failure.
   */

  /**
   * fput      :  S X  ->  S
   * Writes X to stream S, pops X off stack.
   */

  /**
   * fputch      :  S C  ->  S
   * The character C is written to the current position of stream S.
   */

  /**
   * fputchars      :  S "abc.."  ->  S
   * The string abc.. (no quotes) is written to the current position of stream S.
   */

  /**
   * fputstring      :  S "abc.."  ->  S
   * == fputchars, as a temporary alternative.
   */

  /**
   * fseek      :  S P W  ->  S
   * Stream S is repositioned to position P relative to whence-point W,
   * where W = 0, 1, 2 for beginning, current position, end respectively.
   */

  /**
   * ftell      :  S  ->  S I
   * I is the current position of stream S.
   */

  {
    name: 'unstack',
    signature: 'unstack      :  [X Y ..]  ->  ..Y X',
    help: 'The list [X Y ..] becomes the new stack.',
    handlers: [
      [['List'], function (stack) {
        const top = stack.pop()
        stack.clear()
        for (let i = top.value.length - 1; i >= 0; i -= 1) {
          stack.push(top.value[i])
        }
      }]
    ]
  },

  {
    name: 'cons',
    signature: 'cons      :  X A  ->  B',
    help: 'Aggregate B is A with a new member X (first member for sequences).',
    handlers: [
      [['*', 'List'], applyToTop2((X, A) => A.map(xs => [X].concat(xs)))],
      [['Character', 'String'], applyToTop2((X, A) => A.map(cs => X.value.concat(cs)))],
      [['Integer', 'Set'], applyToTop2((X, A) => A.union(new T.JoySet([X])))]
      // TODO: Character into Set? I don't really understand the semantics of character sets
    ]
  },

  {
    name: 'swons',
    signature: 'swons      :  A X  ->  B',
    help: 'Aggregate B is A with a new member X (first member for sequences).',
    handlers: [
      [['List', '*'], applyToTop2((A, X) => A.map(xs => [X].concat(xs)))],
      [['String', 'Character'], applyToTop2((A, X) => A.map(cs => X.value.concat(cs)))],
      [['Set', 'Integer'], applyToTop2((A, X) => A.union(new T.JoySet([X])))]
      // TODO: Character into Set? I don't really understand the semantics of character sets
    ]
  },

  {
    name: 'first',
    signature: 'first      :  A  ->  F',
    help: 'F is the first member of the non-empty aggregate A.',
    handlers: [
      [['NonEmptyAggregate'], applyToTop(x => x.first())]
    ]
  },

  {
    name: 'rest',
    signature: 'rest      :  A  ->  R',
    help: 'R is the non-empty aggregate A with its first member removed.',
    handlers: [
      [['NonEmptyAggregate'], applyToTop(x => x.rest())]
    ]
  },

  {
    name: 'compare',
    signature: 'compare      :  A B  ->  I',
    help: `
I (=-1,0,+1) is the comparison of aggregates A and B.
The values correspond to the predicates <=, =, >=.
`.trim(),
    handlers: [
      // NOTE: Help mentions aggregates, but then points to predicates. The
      // predicate types made more sense, so I went with those. Might not be
      // correct.
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyInt(cmp(x, y)))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyInt(cmp(x, y)))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyInt(cmp(x, y)))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyInt(cmp(x, y)))]
    ]
  },

  /**
   * at      :  A I  ->  X
   * X (= A[I]) is the member of A at position I.
   */

  /**
   * of      :  I A  ->  X
   * X (= A[I]) is the I-th member of aggregate A.
   */

  {
    name: 'size',
    signature: 'size      :  A  ->  I',
    help: 'Integer I is the number of elements of aggregate A.',
    handlers: [
      [['Aggregate'], applyToTop(x =>
        new T.JoyInt(x.length !== undefined ? x.length : x.value.length))]
    ]
  },

  /**
   * opcase      :  X [..[X Xs]..]  ->  [Xs]
   * Indexing on type of X, returns the list [Xs].
   */

  /**
   * case      :  X [..[X Y]..]  ->  Y i
   * Indexing on the value of X, execute the matching Y.
   */

  /**
   * uncons      :  A  ->  F R
   * F and R are the first and the rest of non-empty aggregate A.
   */

  /**
   * unswons      :  A  ->  R F
   * R and F are the rest and the first of non-empty aggregate A.
   */

  /**
   * drop      :  A N  ->  B
   * Aggregate B is the result of deleting the first N elements of A.
   */

  /**
   * take      :  A N  ->  B
   * Aggregate B is the result of retaining just the first N elements of A.
   */

  {
    name: 'concat',
    signature: 'concat      :  S T  ->  U',
    help: 'Sequence U is the concatenation of sequences S and T.',
    handlers: [
      [['List', 'List'], applyToTop2(liftA2(x => y => x.concat(y)))]
    ]
  }

  /**
   * enconcat      :  X S T  ->  U
   * Sequence U is the concatenation of sequences S and T
   * with X inserted between S and T (== swapd cons concat)
   */

  /**
   * name      :  sym  ->  "sym"
   * For operators and combinators, the string "sym" is the name of item sym,
   * for literals sym the result string is its type.
   */

  /**
   * intern      :  "sym"  -> sym
   * Pushes the item whose name is "sym".
   */

  /**
   * body      :  U  ->  [P]
   * Quotation [P] is the body of user-defined symbol U.
   */
]
