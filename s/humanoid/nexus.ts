
import {Nexus, Context, signals, OpSignal} from "@benev/slate"

import {theme} from "./theme.js"
import {Realm} from "./models/realm/realm.js"
import {NetworkTarget} from "./network/target.js"
import {NetworkSession} from "./network/session.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme
	realmOp = signals.op<Realm>()
	network: null | {
		target: NetworkTarget
		sessionOp: OpSignal<NetworkSession>,
	} = null
})

