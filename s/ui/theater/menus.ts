
import {signals} from "@benev/slate"
import {Stage} from "../../stage/stage.js"

export type MenuItem = {
	name: string
	panel: ({}: {stage: Stage}) => any
}

export function menu<P>(name: string, panel: ({}: {stage: Stage}) => P): MenuItem {
	return {name, panel}
}

export class Menus {
	index = signals.signal(0)
	open = signals.signal(true)
	constructor(private readonly items: MenuItem[]) {}

	toggle() {
		this.open.value = !this.open.value
	}

	get names() {
		return this.items.map(({name}, index) => ({
			name,
			active: this.index.value === index,
			activate: () => this.index.value = index,
		}))
	}

	get panel() {
		return this.items[this.index.value].panel
	}
}

