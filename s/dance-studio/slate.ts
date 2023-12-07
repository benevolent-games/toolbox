
import {World} from "./world.js"
import {Context, Slate, html} from "@benev/slate"

export const slate = new Slate(new class extends Context {
	world = new World()
})

