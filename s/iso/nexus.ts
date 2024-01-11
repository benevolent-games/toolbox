
import {Nexus, Context} from "@benev/slate"

import {theme} from "./theme.js"
import {Hub} from "./ecs/hub.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme
	hub = new Hub()
})

