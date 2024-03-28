
import {World} from "./world.js"
import {Basis, FnLogic, FnSystem} from "./types.js"

export class System<Realm, Tick> {
	constructor(
		public readonly name: string,
		public readonly fn: FnSystem<Realm, Tick>,
	) {}

	walk(basis: Basis<Realm>): FnLogic<Realm, Tick>[] {
		return this.fn(basis).flatMap(unit =>
			unit instanceof System
				? unit.walk(basis)
				: unit.fn
		)
	}

	prepareExecutor(basis: {realm: Realm, world: World<Realm>}) {
		const logic = this.walk(basis).map(fn => fn(basis))
		return (tick: Tick) => logic.forEach(fn => {
			if (fn)
				fn(tick)
		})
	}
}

