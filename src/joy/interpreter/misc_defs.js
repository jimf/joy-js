module.exports = () => [
  /**
   * help      :  ->
   * Lists all defined symbols, including those from library files.
   * Then lists all primitives of raw Joy
   * (There is a variant: "_help" which lists hidden symbols).
   */

  /**
   * helpdetail      :  [ S1  S2  .. ]
   * Gives brief help on each symbol S in the list.
   */

  /**
   * manual      :  ->
   * Writes this manual of all Joy primitives to output file.
   */

  /**
   * setautoput      :  I  ->
   * Sets value of flag for automatic put to I (if I = 0, none;
   * if I = 1, put; if I = 2, stack.
   */

  /**
   * setundeferror      :  I  ->
   * Sets flag that controls behavior of undefined functions
   * (0 = no error, 1 = error).
   */

  /**
   * setecho      :  I ->
   * Sets value of echo flag for listing.
   * I = 0: no echo, 1: echo, 2: with tab, 3: and linenumber.
   */

  /**
   * gc      :  ->
   * Initiates garbage collection.
   */

  /**
   * system      :  "command"  ->
   * Escapes to shell, executes string "command".
   * The string may cause execution of another program.
   * When that has finished, the process returns to Joy.
   */

  /**
   * getenv      :  "variable"  ->  "value"
   * Retrieves the value of the environment variable "variable".
   */

  /**
   * argv      :  -> A
   * Creates an aggregate A containing the interpreter's command line arguments.
   */

  /**
   * argc      :  -> I
   * Pushes the number of command line arguments. This is quivalent to 'argv size'.
   */

  /**
   * get      :  ->  F
   * Reads a factor from input and pushes it onto stack.
   */

  /**
   * put      :  X  ->
   * Writes X to output, pops X off stack.
   */

  /**
   * putch      :  N  ->
   * N : numeric, writes character whose ASCII is N.
   */

  /**
   * putchars      :  "abc.."  ->
   * Writes  abc.. (without quotes)
   */

  /**
   * include      :  "filnam.ext"  ->
   * Transfers input to file whose name is "filnam.ext".
   * On end-of-file returns to previous input file.
   */

  /**
   * abort      :  ->
   * Aborts execution of current Joy program, returns to Joy main cycle.
   */

  /**
   * quit      :  ->
   * Exit from Joy.
   */
]
