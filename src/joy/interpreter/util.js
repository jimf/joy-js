const applyToTopN = n => f => stack => {
  const args = new Array(n)
  for (let i = n - 1; i >= 0; i -= 1) {
    args[i] = stack.pop()
  }
  stack.push(f.apply(null, args))
}

exports.applyToTop = applyToTopN(1)
exports.applyToTop2 = applyToTopN(2)
exports.applyToTop3 = applyToTopN(3)
exports.applyToTop4 = applyToTopN(4)
exports.eq = (x, y) => x.equals(y)
exports.ne = (x, y) => !exports.eq(x, y)
exports.lte = (x, y) => x.lte(y)
exports.lt = (x, y) => exports.lte(x, y) && !exports.eq(x, y)
exports.gte = (x, y) => !exports.lt(x, y)
exports.gt = (x, y) => !exports.lte(x, y)
exports.cmp = (x, y) => {
  if (exports.eq(x, y)) {
    return 0
  }
  return exports.lte(x, y) ? -1 : 1
}
