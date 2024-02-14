
import {BehaviorFn} from "./types.js"
import {Selector} from "../core/types.js"

export class Behavior<Realm, Tick, Sel extends Selector> {
	constructor(
		public name: string,
		public selector: Sel,
		public fn: BehaviorFn<Realm, Tick, Sel>,
	) {}
}

