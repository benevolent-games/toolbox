
import {theme} from "./theme.js"
import {Nexus, Context} from "@benev/slate"

export const nexus = new Nexus(new class extends Context {
	theme = theme
})

