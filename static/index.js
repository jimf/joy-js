const Joy = require('../src/joy/joy')

const inputEl = document.querySelector('[name=input]')
const outputEl = document.querySelector('.output-result')
const history = []
const joy = Joy()
let pointer

function runInput (input) {
  try {
    const result = joy.run(input)
    outputEl.textContent = result
    history.push(input)
    pointer = history.length - 1
    inputEl.value = ''
  } catch (e) {
    outputEl.textContent = e.toString()
    throw e
  }
}

function prevInput () {
  if (pointer > 0) { pointer -= 1 }
  inputEl.value = history[pointer] || ''
}

function nextInput () {
  if (pointer < history.length) { pointer += 1 }
  inputEl.value = history[pointer] || ''
}

function onInputKeydown (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    runInput(inputEl.value.trim())
  } else if (e.key === 'p' && e.ctrlKey) {
    e.preventDefault()
    prevInput()
  } else if (e.key === 'n' && e.ctrlKey) {
    e.preventDefault()
    nextInput()
  }
}

inputEl.addEventListener('keydown', onInputKeydown)
