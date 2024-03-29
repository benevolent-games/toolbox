
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
			{...this.selector, ...selector},
			{...this.state, ...state} as State<Sel2 & Sel>,
		)
	}

	add<Sel2 extends Selector>(archetype: Archetype<Sel2>) {
		return new Archetype<Sel2 & Sel>(
			{...this.selector, ...archetype.selector},
			{...this.state, ...archetype.state} as State<Sel2 & Sel>,
		)
	}
}

