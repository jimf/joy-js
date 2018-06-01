# joy-js

A JavaScript interpreter for the [Joy][] programming language.

*Work in progress*

## Todo

- [x] Lexer
- [ ] Parser (partially working)
- [ ] Interpreter (in progress)
- [ ] Demo site

## How to run

For the time being, the only way to run __joy-js__ is through Node directly.
Demo site is planned.

    $ node
    > Joy = require('./src/joy/joy')
    > Joy.run('19 23 + .')
    '42'
    >

## License

MIT

[Joy]: https://en.wikipedia.org/wiki/Joy_(programming_language)
