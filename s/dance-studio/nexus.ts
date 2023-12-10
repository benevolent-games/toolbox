
import {Nexus, Context} from "@benev/slate"

import {theme} from "./theme.js"
import {World} from "./models/world/world.js"
import {Loader} from "./models/loader/loader.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme
	world = new World()
	loader = new Loader(this.world.scene)
})

