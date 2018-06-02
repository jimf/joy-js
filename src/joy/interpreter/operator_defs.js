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
  min: applyToTop2(Math.min),

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

  /**
   * unstack      :  [X Y ..]  ->  ..Y X
   * The list [X Y ..] becomes the new stack.
   */

  /**
   * cons      :  X A  ->  B
   * Aggregate B is A with a new member X (first member for sequences).
   */

  /**
   * swons      :  A X  ->  B
   * Aggregate B is A with a new member X (first member for sequences).
   */

  /**
   * first      :  A  ->  F
   * F is the first member of the non-empty aggregate A.
   */

  /**
   * rest      :  A  ->  R
   * R is the non-empty aggregate A with its first member removed.
   */

  /**
   * compare      :  A B  ->  I
   * I (=-1,0,+1) is the comparison of aggregates A and B.
   * The values correspond to the predicates <=, =, >=.
   */

  /**
   * at      :  A I  ->  X
   * X (= A[I]) is the member of A at position I.
   */

  /**
   * of      :  I A  ->  X
   * X (= A[I]) is the I-th member of aggregate A.
   */

  /**
   * size      :  A  ->  I
   * Integer I is the number of elements of aggregate A.
   */

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

  /**
   * concat      :  S T  ->  U
   * Sequence U is the concatenation of sequences S and T.
   */
  concat: function (stack) {
    const top = stack.pop()
    const bottom = stack.pop()
    stack.push(bottom.concat(top))
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
}
