
import {Unit} from "./types.js"
import {Behavior} from "./behavior.js"
import {Responder} from "./responder.js"

export class System<Realm, Tick> {
	constructor(
		public name: string,
		public children: Unit<Realm, Tick>[],
	) {}

	walk(fns: WalkFns) {
		System.walk(this, fns)
	}

	static walk(system: System<any, any>, fns: WalkFns) {
		const {
			unit: fnUnit = () => {},
			system: fnSystem = () => {},
			behavior: fnBehavior = () => {},
			responder: fnResponder = () => {},
		} = fns

		fnUnit(system)
		fnSystem(system)

		for (const unit of system.children) {
			if (unit instanceof Behavior) {
				fnUnit(unit)
				fnBehavior(unit)
			}
			else if (unit instanceof Responder) {
				fnUnit(unit)
				fnResponder(unit)
			}
			else if (unit instanceof System) {
				fnUnit(unit)
				fnSystem(unit)
				this.walk(unit, fns)
			}
			else {
				throw new Error(`invalid unit in system "${system.name}"`)
			}
		}
	}
}

type WalkFns = {
	unit?: (unit: Unit<any, any>) => void
	system?: (system: System<any, any>) => void
	behavior?: (behavior: Behavior<any, any, any>) => void
	responder?: (responder: Responder<any, any>) => void
}

