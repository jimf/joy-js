# joy-js

A JavaScript interpreter for the [Joy][] programming language.

*Work in progress*

## Todo

- [x] Lexer
- [x] Parser
- [ ] Interpreter (in progress)
  - [x] Operand words defined (Skipped: `conts`, `undefs`, `clock`, `stdin`, `stdout`, `stderr`)
  - [ ] Operator words defined (Skipped: `frexp`, `strftime`, `srand`, `fclose`, `feof`, `ferror`, `fflush`, `fgetch`, `fgets`, `fopen`, `fread`, `fwrite`, `fremove`, `frename`, `fput`, `fputch`, `fputchars`, `fputstring`, `fseek`, `ftell`; partial functionality: `format`, `formatf`)
  - [ ] Predicate words defined
  - [ ] Combinator words defined
  - [ ] "Miscellaneous" words defined
- [ ] Demo site (simple site available, must run locally)
  - [x] Basic site
  - [ ] Make responsive
  - [ ] Publish to GitHub pages
  - [ ] Syntax-highlighted editor
  - [ ] Add output options
  - [ ] Joy tutorial or similar?

## How to run

For the time being, the only way to run __joy-js__ is through Node directly.
Demo site is planned.

The interpreter may be run locally via the Node repl, or via a local express
server.

__Node.js repl:__

    $ node
    > Joy = require('./src/joy/joy')
    > Joy.run('19 23 + .')
    '42'
    >

__Dev server:__

    $ npm install
    $ npm start

## Motivation

This project started after the following [tweet](https://twitter.com/lorentzframe/status/997997523301117953)
by [@lorentzframe](https://twitter.com/lorentzframe) popped into my Twitter
timeline:

> "SICP" by Abelson & Sussman should be read continuously, ~2 pages a day,
> returning to page 1 every year. Ditto "Thinking Forth" by Leo Brodie, tho'
> only ~1 page a day. The former teaches how to think, the latter how to
> engineer. Both are in unpopular languages, on purpose.'"

I own SICP, and while the suggestion of re-reading it yearly strikes me as a
tad extreme, I do think the content is great. "Thinking Forth" on the other
hand was completely new to me. Within a few days time I had found myself
combing through content on Forth on the web, as well as related, concatenative
/ stack-based languages, including Joy. In that search, I stumbled on
[this online Forth interpreter](https://brendanator.github.io/jsForth/) written
in JavaScript, and immediately fell in love with the idea. I wanted to do
something similar. Joy looked like a good target, as there is little in the way
of actual working implementations, and the syntax and surface area are
relatively small. Thus, joy-js was born.

## License

MIT

[Joy]: https://en.wikipedia.org/wiki/Joy_(programming_language)
