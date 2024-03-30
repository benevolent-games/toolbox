
import {Id} from "../../tools/id.js"
import {Serializable} from "./types.js"
import {Component} from "./component.js"

export abstract class HybridComponent<
		Realm,
		State extends Serializable = Serializable,
	> extends Component<State> {

	constructor(
			public readonly realm: Realm,
			public readonly entityId: Id,
			state: State,
		) {
		super(entityId, state)
	}

	abstract created(): void
	abstract deleted(): void
}

