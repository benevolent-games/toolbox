
import {loop} from "../../tools/loopy.js"

export class Grouper {
	readonly default = 0xffff0001
	readonly all = 0xffff
	readonly none = 0x0000

	list() {
		return [...loop(16)].map(index => 1 << index)
	}

	combine(...groups: number[]) {
		return groups.reduce((c: number, p: number) => p | c, 0x0000)
	}

	specify(o: {
			filter: number[],
			membership: number[],
		}) {
		const filter = this.combine(...o.filter)
		const membership = this.combine(...o.membership)
		return (filter << 16) | membership
	}
}

