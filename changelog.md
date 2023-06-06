
# changelog

## v0.4.0 - 2023-06-06
- ! upgraded to babylon 6 (from babylon 5).
- ! loopy.js util has replaced loop2d.js, and the looping functions are now generators.
- ! randy.js util has replaced randomly.js. it is class-based and has better ergonomics, more functions, and better naming (notably, 'flip' has been replaced by 'roll').
- turtle has replaced xiome's hamster-html for static site generation, for the toolbox demo site.

## v0.3.0 - 2023-03-18
- ! change fly camera signature
- ! move some trajectory stuff around

## v0.2.0 - 2023-03-18
- ! reworked the fly camera function signatures
  - now there are look keys, they have configurable speeds

## v0.1.0 - 2023-03-17
- ! totally reworked spectator cam.
  - now it's called the "fly camera"
  - movement-related code moved to `s/ambulation`

## v0.0.0 - 2023-03-07
- initial release
