const { applyToTop, applyToTop2 } = require('./util')

module.exports = {
  /**
   * id      :  ->
   * Identity function, does nothing.
   * Any program of the form  P id Q  is equivalent to just  P Q.
   */
  id: x => x,

  /**
   * dup      :   X  ->   X X
   * Pushes an extra copy of X onto stack.
   */
  dup: function (stack) {
    const top = stack.pop()
    stack.push(top)
    stack.push(top)
  },

  /**
   * swap      :   X Y  ->   Y X
   * Interchanges X and Y on top of the stack.
   */
  swap: function (stack) {
    const top = stack.pop()
    const bottom = stack.pop()
    stack.push(top)
    stack.push(bottom)
  },

  /**
   * rollup      :  X Y Z  ->  Z X Y
   * Moves X and Y up, moves Z down
   */
  rollup: function (stack) {
    const top = stack.pop()
    const middle = stack.pop()
    const bottom = stack.pop()
    stack.push(top)
    stack.push(bottom)
    stack.push(middle)
  },

  /**
   * rolldown      :  X Y Z  ->  Y Z X
   * Moves Y and Z down, moves X up
   */
  rolldown: function (stack) {
    const top = stack.pop()
    const middle = stack.pop()
    const bottom = stack.pop()
    stack.push(middle)
    stack.push(top)
    stack.push(bottom)
  },

  /**
   * rotate      :  X Y Z  ->  Z Y X
   * Interchanges X and Z
   */
  rotate: function (stack) {
    const top = stack.pop()
    const middle = stack.pop()
    const bottom = stack.pop()
    stack.push(top)
    stack.push(middle)
    stack.push(bottom)
  },

  /**
   * popd      :  Y Z  ->  Z
   * As if defined by:   popd  ==  [pop] dip
   */
  popd: function (stack) {
    const top = stack.pop()
    stack.pop()
    stack.push(top)
  },

  /**
   * dupd      :  Y Z  ->  Y Y Z
   * As if defined by:   dupd  ==  [dup] dip
   */
  dupd: function (stack) {
    const top = stack.pop()
    const bottom = stack.pop()
    stack.push(bottom)
    stack.push(bottom)
    stack.push(top)
  },

  /**
   * swapd      :  X Y Z  ->  Y X Z
   * As if defined by:   swapd  ==  [swap] dip
   */
  swapd: function (stack) {
    const top = stack.pop()
    const middle = stack.pop()
    const bottom = stack.pop()
    stack.push(middle)
    stack.push(bottom)
    stack.push(top)
  },

  /**
   * rollupd      :  X Y Z W  ->  Z X Y W
   * As if defined by:   rollupd  ==  [rollup] dip
   */
  rollupd: function (stack) {
    const top = stack.pop()
    const middleTop = stack.pop()
    const middleBot = stack.pop()
    const bottom = stack.pop()
    stack.push(middleTop)
    stack.push(bottom)
    stack.push(middleBot)
    stack.push(top)
  },

  /**
   * rolldownd      :  X Y Z W  ->  Y Z X W
   * As if defined by:   rolldownd  ==  [rolldown] dip
   */
  rolldownd: function (stack) {
    const top = stack.pop()
    const middleTop = stack.pop()
    const middleBot = stack.pop()
    const bottom = stack.pop()
    stack.push(middleBot)
    stack.push(middleTop)
    stack.push(bottom)
    stack.push(top)
  },

  /**
   * rotated      :  X Y Z W  ->  Z Y X W
   * As if defined by:   rotated  ==  [rotate] dip
   */
  rotated: function (stack) {
    const top = stack.pop()
    const middleTop = stack.pop()
    const middleBot = stack.pop()
    const bottom = stack.pop()
    stack.push(middleTop)
    stack.push(middleBot)
    stack.push(bottom)
    stack.push(top)
  },

  /**
   * pop      :   X  ->
   * Removes X from top of the stack.
   */
  pop: function (stack) {
    stack.pop()
  },

  /**
   * choice      :  B T F  ->  X
   * If B is true, then X = T else X = F.
   */
  choice: function (stack) {
    const top = stack.pop()
    const middle = stack.pop()
    const bottom = stack.pop()
    stack.push(bottom === true ? middle : top)
  },

  /**
   * or      :  X Y  ->  Z
   * Z is the union of sets X and Y, logical disjunction for truth values.
   * TODO
   */

  /**
   * xor      :  X Y  ->  Z
   * Z is the symmetric difference of sets X and Y,
   * logical exclusive disjunction for truth values.
   * TODO
   */

  /**
   * and      :  X Y  ->  Z
   * Z is the intersection of sets X and Y, logical conjunction for truth values.
   * TODO
   */

  /**
   * not      :  X  ->  Y
   * Y is the complement of set X, logical negation for truth values.
   * TODO
   */

  /**
   * +      :  M I  ->  N
   * Numeric N is the result of adding integer I to numeric M.
   * Also supports float.
   */
  '+': applyToTop2((x, y) => x + y),

  /**
   * -      :  M I  ->  N
   * Numeric N is the result of subtracting integer I from numeric M.
   * Also supports float.
   */
  '-': applyToTop2((x, y) => x - y),

  /**
   * *      :  I J  ->  K
   * Integer K is the product of integers I and J.  Also supports float.
   */
  '*': applyToTop2((x, y) => x * y),

  /**
   * /      :  I J  ->  K
   * Integer K is the (rounded) ratio of integers I and J.  Also supports float.
   */
  '/': applyToTop2((x, y) => Math.floor(x / y)),

  /**
   * rem      :  I J  ->  K
   * Integer K is the remainder of dividing I by J.  Also supports float.
   */
  rem: applyToTop2((x, y) => x % y),

  /**
   * div      :  I J  ->  K L
   * Integers K and L are the quotient and remainder of dividing I by J.
   */
  div: function (stack) {
    const top = stack.pop()
    const bottom = stack.pop()
    stack.push(Math.floor(bottom / top))
    stack.push(Math.floor(bottom % top))
  },

  /**
   * sign      :  N1  ->  N2
   * Integer N2 is the sign (-1 or 0 or +1) of integer N1,
   * or float N2 is the sign (-1.0 or 0.0 or 1.0) of float N1.
   */
  sign: function (stack) {
    const top = stack.pop()
    if (top === 0) {
      stack.push(0)
    } else if (top > 0) {
      stack.push(1)
    } else {
      stack.push(-1)
    }
  },

  /**
   * neg      :  I  ->  J
   * Integer J is the negative of integer I.  Also supports float.
   */
  neg: applyToTop(x => -x),

  /**
   * abs      :  N1  ->  N2
   * Integer N2 is the absolute value (0,1,2..) of integer N1,
   * or float N2 is the absolute value (0.0 ..) of float N1
   */
  abs: applyToTop(Math.abs),

  /**
   * acos      :  F  ->  G
   * G is the arc cosine of F.
   */
  acos: applyToTop(Math.acos),

  /**
   * asin      :  F  ->  G
   * G is the arc sine of F.
   */
  asin: applyToTop(Math.asin),

  /**
   * atan      :  F  ->  G
   * G is the arc tangent of F.
   */
  atan: applyToTop(Math.atan),

  /**
   * atan2      :  F G  ->  H
   * H is the arc tangent of F / G.
   */
  atan2: applyToTop2((x, y) => Math.atan(x / y)),

  /**
   * ceil      :  F  ->  G
   * G is the float ceiling of F.
   */
  ceil: applyToTop(Math.ceil),

  /**
   * cos      :  F  ->  G
   * G is the cosine of F.
   */
  cos: applyToTop(Math.cos),

  /**
   * cosh      :  F  ->  G
   * G is the hyperbolic cosine of F.
   */
  cosh: applyToTop(Math.cosh),

  /**
   * exp      :  F  ->  G
   * G is e (2.718281828...) raised to the Fth power.
   */
  exp: applyToTop(Math.exp),

  /**
   * floor      :  F  ->  G
   * G is the floor of F.
   */
  floor: applyToTop(Math.floor),

  /**
   * frexp      :  F  ->  G I
   * G is the mantissa and I is the exponent of F.
   * Unless F = 0, 0.5 <= abs(G) < 1.0.
   * TODO (not easy in JS)
   */

  /**
   * ldexp      :  F I  -> G
   * G is F times 2 to the Ith power.
   */
  ldexp: applyToTop2((x, y) => x * Math.pow(2, y)),

  /**
   * log      :  F  ->  G
   * G is the natural logarithm of F.
   */
  log: applyToTop(Math.log),

  /**
   * log10      :  F  ->  G
   * G is the common logarithm of F.
   */
  log10: applyToTop(Math.log10),

  /**
   * modf      :  F  ->  G H
   * G is the fractional part and H is the integer part
   * (but expressed as a float) of F.
   */
  modf: function (stack) {
    const top = stack.pop()
    const intPart = Math.floor(top)
    stack.push(top % intPart)
    stack.push(intPart)
  },

  /**
   * pow      :  F G  ->  H
   * H is F raised to the Gth power.
   */
  pow: applyToTop2(Math.pow),

  /**
   * sin      :  F  ->  G
   * G is the sine of F.
   */
  sin: applyToTop(Math.sin),

  /**
   * sinh      :  F  ->  G
   * G is the hyperbolic sine of F.
   */
  sinh: applyToTop(Math.sinh),

  /**
   * sqrt      :  F  ->  G
   * G is the square root of F.
   */
  sqrt: applyToTop(Math.sqrt),

  /**
   * tan      :  F  ->  G
   * G is the tangent of F.
   */
  tan: applyToTop(Math.tan),

  /**
   * tanh      :  F  ->  G
   * G is the hyperbolic tangent of F.
   */
  tanh: applyToTop(Math.tanh),

  /**
   * trunc      :  F  ->  I
   * I is an integer equal to the float F truncated toward zero.
   */
  trunc: applyToTop(Math.trunc),

  /**
   * max      :  N1 N2  ->  N
   * N is the maximum of numeric values N1 and N2.  Also supports float.
   */
  max: applyToTop2(Math.max),

  /**
   * min      :  N1 N2  ->  N
   * N is the minimum of numeric values N1 and N2.  Also supports float.
   */
  min: applyToTop2(Math.min)
}
