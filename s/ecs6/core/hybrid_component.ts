
import {Serializable} from "./types.js"
import {Component} from "./component.js"

export abstract class HybridComponent<
		Realm,
		State extends Serializable,
	> extends Component<State> {

	constructor(public realm: Realm, state: State) {
		super(state)
		this.init()
	}

	abstract init(): void
	abstract deleted(): void
}

