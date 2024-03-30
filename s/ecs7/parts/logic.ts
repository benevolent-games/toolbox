
import {FnLogic} from "./types.js"

export class Logic<Realm, Tick> {
	constructor(
		public readonly name: string,
		public readonly fn: FnLogic<Realm, Tick>,
	) {}
}

