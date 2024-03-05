
import {loop} from "../../tools/loopy.js"

export class Grouping {
	static readonly default = 0xffff0001

	static all() {
		return [...loop(16)].map(index => 1 << index)
	}

	static combine(...groups: number[]) {
		return groups.reduce((c: number, p: number) => p | c, 0x0000)
	}

	static group(o: {
			filter: number[],
			membership: number[],
		}) {
		const filter = this.combine(...o.filter)
		const membership = this.combine(...o.membership)
		return (filter << 16) | membership
	}
}

