
import {Serializable} from "./types.js"
import {Component} from "./component.js"

export abstract class HybridComponent<
		Realm,
		State extends Serializable,
	> extends Component<State> {

	constructor(public realm: Realm, state: State) {
		super(state, () => this.updated())
	}

	abstract created(): void
	abstract updated(): void
	abstract deleted(): void
}

