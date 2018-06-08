const { applyToTop, applyToTop2, eq, ne, lte, lt, gte, gt } = require('./util')
const T = require('./types')

module.exports = [
  {
    name: 'null',
    signature: 'null      :  X  ->  B',
    help: 'Tests for empty aggregate X or zero numeric.',
    handlers: [
      [['Integer'], applyToTop(x => new T.JoyBool(x.value === 0))],
      [['Character'], applyToTop(x => new T.JoyBool(x.value === String.fromCharCode(0)))],
      [['Aggregate'], applyToTop(x => new T.JoyBool(x.length === 0))]
    ]
  },

  {
    name: 'small',
    signature: 'small      :  X  ->  B',
    help: 'Tests whether aggregate X has 0 or 1 members, or numeric 0 or 1.',
    handlers: [
      [['Aggregate'], applyToTop(x => new T.JoyBool(x.length === 0 || x.length === 1))],
      [['Integer'], applyToTop(x => new T.JoyBool(x.value === 0 || x.value === 1))],
      [['Character'], applyToTop(x => new T.JoyBool(x.value === String.fromCharCode(0) || x.value === String.fromCharCode(1)))]
    ]
  },

  {
    name: '>=',
    signature: '>=      :  X Y  ->  B',
    help: `
Either both X and Y are numeric or both are strings or symbols.
Tests whether X greater than or equal to Y.  Also supports float.
`.trim(),
    handlers: [
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(gte(x, y)))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(gte(x, y)))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(gte(x, y)))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(gte(x, y)))]
    ]
  },

  {
    name: '>',
    signature: '>      :  X Y  ->  B',
    help: `
Either both X and Y are numeric or both are strings or symbols.
Tests whether X greater than Y.  Also supports float.
`.trim(),
    handlers: [
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(gt(x, y)))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(gt(x, y)))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(gt(x, y)))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(gt(x, y)))]
    ]
  },

  {
    name: '<=',
    signature: '<=      :  X Y  ->  B',
    help: `
Either both X and Y are numeric or both are strings or symbols.
Tests whether X less than or equal to Y.  Also supports float.
`.trim(),
    handlers: [
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(lte(x, y)))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(lte(x, y)))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(lte(x, y)))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(lte(x, y)))]
    ]
  },

  {
    name: '<',
    signature: '<      :  X Y  ->  B',
    help: `
Either both X and Y are numeric or both are strings or symbols.
Tests whether X less than Y.  Also supports float.
`.trim(),
    handlers: [
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(lt(x, y)))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(lt(x, y)))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(lt(x, y)))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(lt(x, y)))]
    ]
  },

  {
    name: '!=',
    signature: '!=      :  X Y  ->  B',
    help: `
Either both X and Y are numeric or both are strings or symbols.
Tests whether X not equal to Y.  Also supports float.
`.trim(),
    handlers: [
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(ne(x, y)))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(ne(x, y)))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(ne(x, y)))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(ne(x, y)))]
    ]
  },

  {
    name: '=',
    signature: '=      :  X Y  ->  B',
    help: `
Either both X and Y are numeric or both are strings or symbols.
Tests whether X equal to Y.  Also supports float.
`.trim(),
    handlers: [
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(eq(x, y)))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(eq(x, y)))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(eq(x, y)))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(eq(x, y)))]
    ]
  },

  {
    name: 'equal',
    signature: 'equal      :  T U  ->  B',
    help: '(Recursively) tests whether trees T and U are identical.',
    handlers: [
      [['List', 'List'], applyToTop2((x, y) => new T.JoyBool(eq(x, y)))]
    ]
  },

  {
    name: 'has',
    signature: 'has      :  A X  ->  B',
    help: 'Tests whether aggregate A has X as a member.',
    handlers: [
      [['List', '*'], applyToTop2((x, y) => new T.JoyBool(x.value.find(m => m.value === y.value)))],
      [['String', 'Character'], applyToTop2((x, y) => new T.JoyBool(x.value.indexOf(y.value) >= 0))],
      [['Set', 'Integer'], applyToTop2((x, y) => new T.JoyBool(x.has(y)))]
    ]
  },

  {
    name: 'in',
    signature: 'in      :  X A  ->  B',
    help: 'Tests whether X is a member of aggregate A.',
    handlers: [
      [['List', '*'], applyToTop2((x, y) => new T.JoyBool(y.value.find(m => m.value === x.value)))],
      [['String', 'Character'], applyToTop2((x, y) => new T.JoyBool(y.value.indexOf(x.value) >= 0))],
      [['Set', 'Integer'], applyToTop2((x, y) => new T.JoyBool(y.has(x)))]
    ]
  },

  {
    name: 'integer',
    signature: 'integer      :  X  ->  B',
    help: 'Tests whether X is an integer.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!!x.isInteger))]
    ]
  },

  {
    name: 'char',
    signature: 'char      :  X  ->  B',
    help: 'Tests whether X is a character.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!!x.isCharacter))]
    ]
  },

  {
    name: 'logical',
    signature: 'logical      :  X  ->  B',
    help: 'Tests whether X is a logical.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!!x.isLogical))]
    ]
  },

  {
    name: 'set',
    signature: 'set      :  X  ->  B',
    help: 'Tests whether X is a set.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!!x.isSet))]
    ]
  },

  {
    name: 'string',
    signature: 'string      :  X  ->  B',
    help: 'Tests whether X is a string.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!!x.isString))]
    ]
  },

  {
    name: 'list',
    signature: 'list      :  X  ->  B',
    help: 'Tests whether X is a list.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!!x.isList))]
    ]
  },

  {
    name: 'leaf',
    signature: 'leaf      :  X  ->  B',
    help: 'Tests whether X is not a list.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!x.isList))]
    ]
  },

  /**
   * user      :  X  ->  B
   * Tests whether X is a user-defined symbol.
   * TODO: not sure how this will be distinguished yet
   */

  {
    name: 'float',
    signature: 'float      :  R  ->  B',
    help: 'Tests whether R is a float.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!!x.isFloat))]
    ]
  }

  /**
   * file      :  F  ->  B
   * Tests whether F is a file.
   * TODO: Not sure how file io will be implemented.
   */
]
