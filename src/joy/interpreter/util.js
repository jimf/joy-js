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
