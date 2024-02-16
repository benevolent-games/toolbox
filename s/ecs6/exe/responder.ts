
import {ResponderFn} from "./types.js"
import {Selector} from "../core/types.js"

export class Responder<Realm, Sel extends Selector> {
	constructor(
		public name: string,
		public selector: Sel,
		public fn: ResponderFn<Realm, Sel>
	) {}
}

