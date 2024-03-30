
# ecs todo

- [X] `always` behavior that has no query
- [X] ~~rip out the concept of `realm` from ecs, and apps can simply provide their own realm or context or whatever, via their own closure.~~
  - nah, it's actually to integral because of hybrid component and such, so we're keeping it in

- [X] `Archetype` should be a class that combines a selector and the params
  - and have handy methods like `archetype.combine(archetype2)`
  - and world.createEntity and such should accept an archetype
  - `entity.attach(archetype)` should be the way

- [X] `respond` syntax could be streamlined
  - like `responder("cool responder").select({Whatever}).respond(tick => components => dispose())`

- [X] `system` should be renamed to `group` or maybe `logic`
  - a new concept of `system` should be a blank-slate whereby `behavior`, `responder`, `always`, are all sub-types of `system`

- [X] world ergonomics
  - ~~we need to be able to search for entities without attaching persistent queries~~
    - nah actually the idea was that all queries are persistent because under the hood they are de-duped and reused

