
import {Nexus, Context, signals} from "@benev/slate"

import {theme} from "./theme.js"
import {Realm} from "./models/realm/realm.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme
	realmOp = signals.op<Realm>()
})

