const { applyToTop, applyToTop2 } = require('./util')
const T = require('./types')

module.exports = [
  {
    name: 'null',
    signature: 'null      :  X  ->  B',
    help: 'Tests for empty aggregate X or zero numeric.',
    handlers: [
      [['Integer'], applyToTop(x => new T.JoyBool(x.value === 0))],
      [['Character'], applyToTop(x => new T.JoyBool(x.value === String.fromCharCode(0)))],
      [['List'], applyToTop(x => new T.JoyBool(x.length === 0))]
    ]
  },

  {
    name: 'small',
    signature: 'small      :  X  ->  B',
    help: 'Tests whether aggregate X has 0 or 1 members, or numeric 0 or 1.',
    handlers: [
      [['List'], applyToTop(x => new T.JoyBool(x.length === 0 || x.length === 1))],
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
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() >= y.toNumber()))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() >= y.toNumber()))],
      // NOTE: Not sure if semantics of string/symbol comparison are correct here.
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(x.value >= y.value))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(x.value >= y.value))]
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
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() > y.toNumber()))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() > y.toNumber()))],
      // NOTE: Not sure if semantics of string/symbol comparison are correct here.
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(x.value > y.value))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(x.value > y.value))]
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
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() <= y.toNumber()))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() <= y.toNumber()))],
      // NOTE: Not sure if semantics of string/symbol comparison are correct here.
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(x.value <= y.value))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(x.value <= y.value))]
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
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() < y.toNumber()))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() < y.toNumber()))],
      // NOTE: Not sure if semantics of string/symbol comparison are correct here.
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(x.value < y.value))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(x.value < y.value))]
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
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() !== y.toNumber()))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() !== y.toNumber()))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(x.value !== y.value))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(x.value !== y.value))]
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
      [['Numeric', 'Numeric'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() === y.toNumber()))],
      [['Float', 'Float'], applyToTop2((x, y) => new T.JoyBool(x.toNumber() === y.toNumber()))],
      [['String', 'String'], applyToTop2((x, y) => new T.JoyBool(x.value === y.value))],
      [['Symbol', 'Symbol'], applyToTop2((x, y) => new T.JoyBool(x.value === y.value))]
    ]
  },

  /**
   * equal      :  T U  ->  B
   * (Recursively) tests whether trees T and U are identical.
   * TODO: not sure yet what trees will look like
   * update: I think trees are simply nested quotations
   */

  {
    name: 'has',
    signature: 'has      :  A X  ->  B',
    help: 'Tests whether aggregate A has X as a member.',
    handlers: [
      [['List', '*'], applyToTop2((x, y) => new T.JoyBool(x.value.find(m => m.value === y.value)))]
      // TODO: is Set an aggregate?
    ]
  },

  {
    name: 'in',
    signature: 'in      :  X A  ->  B',
    help: 'Tests whether X is a member of aggregate A.',
    handlers: [
      [['List', '*'], applyToTop2((x, y) => new T.JoyBool(y.value.find(m => m.value === x.value)))]
      // TODO: is Set an aggregate?
    ]
  },

  {
    name: 'integer',
    signature: 'integer      :  X  ->  B',
    help: 'Tests whether X is an integer.',
    handlers: [
      [['*'], applyToTop(x => new T.JoyBool(!!x.isBool))]
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

  /**
   * leaf      :  X  ->  B
   * Tests whether X is not a list.
   * TODO: unsure of semanics here. would the empty list inside a list be a leaf?
   */

  /**
   * user      :  X  ->  B
   * Tests whether X is a user-defined symbol.
   * TODO: not sure how this will be distinguished yet
   */

  /**
   * float      :  R  ->  B
   * Tests whether R is a float.
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
