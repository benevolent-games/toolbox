
export type GroupsRaw<G extends string> = {[K in G]: number}
export type Groupings = {filter: number[], membership: number[]}

export const default_groups = 0xffff0001

export class PhysicsGroups<G extends string> {
	static make = <G extends string>(...keys: G[]) => new this(...keys)
	readonly all = [0xffff]
	readonly none = [0x0000]
	#keys: G[]

	constructor(...keys: G[]) {
		this.#keys = keys
	}

	get raw() {
		return Object.fromEntries(
			this.#keys.map((key, index) => [key, 1 << index])
		) as GroupsRaw<G>
	}

	group(fn: (groups: GroupsRaw<G>, {}: {all: number[], none: number[]}) => Groupings) {
		const g = fn(this.raw, {all: this.all, none: this.none})
		const sum = (c: number, p: number) => (p | c)
		const zero = 0x0000
		const filter = g.filter.reduce(sum, zero)
		const membership = g.membership.reduce(sum, zero)
		return (filter << 16) | membership
	}
}

