exports.applyToTop = function applyToTop (f) {
  return function (stack) {
    stack.push(f(stack.pop()))
  }
}

exports.applyToTop2 = function applyToTop2 (f) {
  return function (stack) {
    const top = stack.pop()
    const bottom = stack.pop()
    stack.push(f(bottom, top))
  }
}
