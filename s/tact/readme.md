
# tact

*user input system*

- you setup `bindings` which associate "actions" to actual key presses
- bindings are organized into "modes"
- zero or one modes can be active at once

<br/>

## first, establish your app's bindings

```ts
import {Tact} from "@benev/toolbox"

const bindings = Tact.bindings(({mode, buttons, b, mod, shift}) => ({
  myMode: mode({
    vectors: {},
    buttons: {

      // this action will respond when "A" is pressed
      myAction1: buttons(b("KeyA")),

      // respond when we press "A" or "B"
      myAction2: buttons(b("KeyA"), b("KeyB")),

      // responds to "A" but not "Shift+A",
      // that is, it cares about modifiers
      myAction3: buttons(mod("KeyA")),

      // responds to "Shift+A" but not "A",
      myAction4: buttons(mod("KeyA", shift)),
    },
  }),
}))
```

<br/>

## second, create your app's Tact instance

you must attach some devices

```ts
const tact = new Tact(window, bindings)

tact.devices
  .add(new Tact.devices.Keyboard())

```

## TODO: finish this readme -- i kinda got side-tracked

