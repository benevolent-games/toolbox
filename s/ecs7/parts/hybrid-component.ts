
import {Serializable} from "./types.js"
import {Component} from "./component.js"

export abstract class HybridComponent<
		Realm,
		State extends Serializable = Serializable,
	> extends Component<State> {

	constructor(
			public readonly realm: Realm,
			state: State,
		) {
		super(state)
	}

	abstract created(): void
	abstract deleted(): void
}

