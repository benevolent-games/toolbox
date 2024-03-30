
import {World} from "./world.js"
import {Logic} from "./logic.js"
import {Basis, FnSystem} from "./types.js"

export class System<Realm, Tick> {
	constructor(
		public readonly name: string,
		public readonly fn: FnSystem<Realm, Tick>,
	) {}

	walk(basis: Basis<Realm>): Logic<Realm, Tick>[] {
		return this.fn(basis).flatMap(unit =>
			unit instanceof System
				? unit.walk(basis)
				: unit
		)
	}

	prepareExecutor(basis: {realm: Realm, world: World<Realm>}) {
		const logics = this.walk(basis).map(logic => ({
			name: logic.name,
			fn: logic.fn(basis),
		}))
		return (tick: Tick) => logics.forEach(({fn}) => {
			if (fn)
				fn(tick)
		})
	}
}

