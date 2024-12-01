
# changelog

- 🟥 *harmful -- breaking change*
- 🔶 *maybe harmful -- deprecation, or possible breaking change*
- 🍏 *harmless -- addition, fix, or enhancement*

<br/>

## v0.7

### 0.7.7
- 🔶 deprecate `Radians.to` and `Radians.from`
  - `Radians.to.degrees(3.14)` becomes `Radians.toDegrees(3.14)`
  - `Radians.from.degrees(180)` becomes `Degrees.toRadians(180)`
  - similar pattern as new `Degrees.toRadians` with new `Turns.toRadians` and `Arcseconds.toRadians`

### v0.7.0 to v0.7.6
- 🍏 **new math2**
  - vector math, scalar math, etc, it's all been redone
  - the old math has been deprecated
  - to keep using the old deprecated math, for now,
    - change imports like `import {vec3} from "@benev/toolbox"`
    - to `import {vec3} from "@benev/toolbox/x/math/exports.js"`
  - to use the new math, import the new utilities
    - `import {Vec3, Scalar, Randy} from "@benev/toolbox"`
  - i'm not gonna document every change so read the source
  - but i will say:
    - the new vector classes are objects with methods, allowing us to use nicer chaining syntax
    - all methods will operate on the values *in-place* which is a bold move
    - i wanted the chainability, but it's also a serious performance concern to not clutter the gc with bazillions of stupid vector objects
    - you need to use `.clone()` when you wanna make a copy of something

## v0.6.0

- ! delete: `stage` and `vista`, in favor of new `iron`
- removed obsolete emission fix from loadGlb
- add orchestrator
- add 'smooth' tool

## v0.6.0-13
- ! removed `op_effect`
  - use `loading` from `@benev/slate` instead
- ! removed `plainNexus`
  - use `defaultNexus` from `@benev/slate` instead
- ! removed `cssReset`
  - use `defaultTheme` from `@benev/slate` instead

## v0.6.0-12
- honestly i kinda stopped recording changes for a long time here

## v0.5.0-dev.0 - 2023-06-30
- ! <benev-theater> mobile controls default to being *disabled*, and can be enabled by adding the `mobile-controls` attribute

## v0.4.1 - 2023-06-14
- use turtle's standard build
- add npm bin `toolbox-cleanup-babylon` script in `scripts/`

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
