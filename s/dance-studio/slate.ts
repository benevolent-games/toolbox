
import {Context, Slate} from "@benev/slate"

import {theme} from "./theme.js"
import {World} from "./models/world.js"
import {Loader} from "./models/loader.js"
import {Impulse} from "../impulse/impulse.js"
import {Stick} from "../impulse/nubs/stick/device.js"

export const slate = new Slate(new class extends Context {
	theme = theme
	world = new World()
	loader = new Loader(this.world.scene)

	sticks = {
		movement: new Stick("movement"),
	}

	impulse = new Impulse({
		binds: {
			normal: {
				buttons: {},
				vectors: {movement: ["movement"]},
			},
		},
		devices: [
			this.sticks.movement,
		],
		modes: [
			"normal",
		],
	})
})

