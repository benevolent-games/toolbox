
import {Nexus, Context} from "@benev/slate"

import {theme} from "./theme.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme
})

