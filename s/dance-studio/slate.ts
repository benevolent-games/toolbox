
import {World} from "./models/world.js"
import {Loader} from "./models/loader.js"
import {Context, Slate} from "@benev/slate"

export const slate = new Slate(new class extends Context {
	world = new World()
	loader = new Loader(this.world.scene)
})

