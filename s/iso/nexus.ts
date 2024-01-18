
import {Nexus, Context} from "@benev/slate"

import {theme} from "./theme.js"
import {IsoBase} from "./ecs/hub.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme
	base = new IsoBase()
})

