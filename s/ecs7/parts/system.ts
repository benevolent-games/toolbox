
import {Logic} from "./logic.js"
import {World} from "./world.js"
import {FnLogic} from "./types.js"

export class System<Realm, Tick> {
	constructor(
		public readonly name: string,
		public readonly children: (System<Realm, Tick> | Logic<Realm, Tick>)[],
	) {}

	walk(): FnLogic<Realm, Tick>[] {
		return this.children.flatMap(unit =>
			unit instanceof System
				? unit.walk()
				: unit.fn
		)
	}

	prepareExecutor(o: {realm: Realm, world: World<Realm>}) {
		const logic = this.walk().map(fn => fn(o))
		return (tick: Tick) => logic.forEach(fn => fn(tick))
	}
}

