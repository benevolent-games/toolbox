
import {Nexus, Context} from "@benev/slate"

import {theme} from "./theme.js"
import {Impulse} from "../impulse/impulse.js"
import {World} from "./models/world/world.js"
import {Loader} from "./models/loader/loader.js"
import {Stick} from "../impulse/nubs/stick/device.js"

export const nexus = new Nexus(new class extends Context {
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

