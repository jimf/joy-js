const Joy = require('../src/joy/joy')

const inputEl = document.querySelector('[name=input]')
const outputEl = document.querySelector('.output-result')
const history = []
// let pointer

function onInputKeydown (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    try {
      const input = inputEl.value.trim()
      const result = Joy().run(input)
      outputEl.textContent = result
      history.push(input)
      // pointer = history.length - 1
      inputEl.value = ''
    } catch (e) {
      outputEl.textContent = e.toString()
      throw e
    }
  }
}

inputEl.addEventListener('keydown', onInputKeydown)
