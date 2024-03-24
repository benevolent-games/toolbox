
# ecs todo

- `always` behavior that has no query
- rip out the concept of `realm` from ecs, and apps can simply provide their own realm or context or whatever, via their own closure.

- `Archetype` should be a class that combines a selector and the params
  - and have handy methods like `archetype.combine(archetype2)`
  - and world.createEntity and such should accept an archetype
  - `entity.attach(archetype)` should be the way

- `respond` syntax could be streamlined
  - like `responder("cool responder").select({Whatever}).respond(tick => components => dispose())`

- `system` should be renamed to `group` or maybe `logic`
  - a new concept of `system` should be a blank-slate whereby `behavior`, `responder`, `always`, are all sub-types of `system`

