
import {Selector, State} from "./types.js"

export type Arch<Sel extends Selector> = {
	selector: Sel
	state: State<Sel>
}

export class Archetype<Sel extends Selector> implements Arch<Sel> {
	constructor(
		public selector: Sel,
		public state: State<Sel>,
	) {}

	extend<Sel2 extends Selector>(selector: Sel2, state: State<Sel2>) {
		return new Archetype<Sel2 & Sel>(
			{...this.selector, ...selector} as Sel2 & Sel,
			{...this.state, ...state} as State<Sel2 & Sel>,
		)
	}
}

