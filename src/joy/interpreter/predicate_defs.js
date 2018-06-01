const { applyToTop } = require('./util')

module.exports = {
  /**
   * null      :  X  ->  B
   * Tests for empty aggregate X or zero numeric.
   */
  'null': applyToTop(x => x.length === 0 || x === 0)

  /**
   * small      :  X  ->  B
   * Tests whether aggregate X has 0 or 1 members, or numeric 0 or 1.
   */

  /**
   * >=      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X greater than or equal to Y.  Also supports float.
   */

  /**
   * >      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X greater than Y.  Also supports float.
   */

  /**
   * <=      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X less than or equal to Y.  Also supports float.
   */

  /**
   * <      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X less than Y.  Also supports float.
   */

  /**
   * !=      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X not equal to Y.  Also supports float.
   */

  /**
   * =      :  X Y  ->  B
   * Either both X and Y are numeric or both are strings or symbols.
   * Tests whether X equal to Y.  Also supports float.
   */

  /**
   * equal      :  T U  ->  B
   * (Recursively) tests whether trees T and U are identical.
   */

  /**
   * has      :  A X  ->  B
   * Tests whether aggregate A has X as a member.
   */

  /**
   * in      :  X A  ->  B
   * Tests whether X is a member of aggregate A.
   */

  /**
   * integer      :  X  ->  B
   * Tests whether X is an integer.
   */

  /**
   * char      :  X  ->  B
   * Tests whether X is a character.
   */

  /**
   * logical      :  X  ->  B
   * Tests whether X is a logical.
   */

  /**
   * set      :  X  ->  B
   * Tests whether X is a set.
   */

  /**
   * string      :  X  ->  B
   * Tests whether X is a string.
   */

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
   */
}
