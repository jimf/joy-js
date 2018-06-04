module.exports = [
  /**
   * i      :  [P]  ->  ...
   * Executes P. So, [P] i  ==  P.
   */

  /**
   * x      :  [P]i  ->  ...
   * Executes P without popping [P]. So, [P] x  ==  [P] P.
   */

  /**
   * dip      :  X [P]  ->  ... X
   * Saves X, executes P, pushes X back.
   */

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

  /**
   * cleave      :  X [P1] [P2]  ->  R1 R2
   * Executes P1 and P2, each with X on top, producing two results.
   */

  /**
   * branch      :  B [T] [F]  ->  ...
   * If B is true, then executes T else executes F.
   */

  /**
   * ifte      :  [B] [T] [F]  ->  ...
   * Executes B. If that yields true, then executes T else executes F.
   */

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

  /**
   * fold      :  A V0 [P]  ->  V
   * Starting with value V0, sequentially pushes members of aggregate A
   * and combines with binary operator P to produce value V.
   */

  /**
   * map      :  A [P]  ->  B
   * Executes P on each member of aggregate A,
   * collects results in sametype aggregate B.
   */

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

  /**
   * primrec      :  X [I] [C]  ->  R
   * Executes I to obtain an initial value R0.
   * For integer X uses increasing positive integers to X, combines by C for new R.
   * For aggregate X uses successive members and combines by C for new R.
   */

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
