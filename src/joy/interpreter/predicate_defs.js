const { applyToTop, applyToTop2 } = require('./util')

module.exports = {
  /**
   * null      :  X  ->  B
   * Tests for empty aggregate X or zero numeric.
   */
  'null': applyToTop(x => x.length === 0 || x === 0),

  /**
   * small      :  X  ->  B
   * Tests whether aggregate X has 0 or 1 members, or numeric 0 or 1.
   */
  small: applyToTop(x => x.length === 0 || x.length === 1 || x === 0 || x === 1),

  /**
   * >=      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X greater than or equal to Y.  Also supports float.
   */
  '>=': applyToTop2((x, y) => x >= y),

  /**
   * >      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X greater than Y.  Also supports float.
   */
  '>': applyToTop2((x, y) => x > y),

  /**
   * <=      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X less than or equal to Y.  Also supports float.
   */
  '<=': applyToTop2((x, y) => x <= y),

  /**
   * <      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X less than Y.  Also supports float.
   */
  '<': applyToTop2((x, y) => x < y),

  /**
   * !=      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X not equal to Y.  Also supports float.
   */
  '!=': applyToTop2((x, y) => x !== y),

  /**
   * =      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X equal to Y.  Also supports float.
   */
  '=': applyToTop2((x, y) => x === y),

  /**
   * equal      :  T U  ->  B
   * (Recursively) tests whether trees T and U are identical.
   * TODO: not sure yet what trees will look like
   */

  /**
   * has      :  A X  ->  B
   * Tests whether aggregate A has X as a member.
   */
  has: applyToTop2((x, y) => x.includes(y)),

  /**
   * in      :  X A  ->  B
   * Tests whether X is a member of aggregate A.
   */
  in: applyToTop2((x, y) => y.includes(x)),

  /**
   * integer      :  X  ->  B
   * Tests whether X is an integer.
   */
  integer: applyToTop(x => typeof x === 'number' && x % 1 === 0),

  /**
   * char      :  X  ->  B
   * Tests whether X is a character.
   * NOTE: May need to revisit. Will give false positives for strings of length 1.
   */
  char: applyToTop(x => typeof x === 'string' && x.length === 1),

  /**
   * logical      :  X  ->  B
   * Tests whether X is a logical.
   */
  logical: applyToTop(x => typeof x === 'boolean'),

  /**
   * set      :  X  ->  B
   * Tests whether X is a set.
   * TODO: not sure how sets will be implemented yet
   */

  /**
   * string      :  X  ->  B
   * Tests whether X is a string.
   * TODO: May need to revisit. False positives for chars.
   */
  string: applyToTop(x => typeof x === 'string')

  /**
   * list      :  X  ->  B
   * Tests whether X is a list.
   */

  /**
   * leaf      :  X  ->  B
   * Tests whether X is not a list.
   */

  /**
   * user      :  X  ->  B
   * Tests whether X is a user-defined symbol.
   */

  /**
   * float      :  R  ->  B
   * Tests whether R is a float.
   */

  /**
   * file      :  F  ->  B
   * Tests whether F is a file.
   * TODO: Not sure how file io will be implemented.
   */
}
