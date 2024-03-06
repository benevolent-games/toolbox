
import {Physics} from "../physics.js"
import {Constructor, Pojo} from "@benev/slate"
import {uncapitalize} from "../../tools/uncapitalize.js"

export function instantiators<P extends Pojo<Constructor<any>>>(t: Physics, p: P) {
	return Object.fromEntries(
		Object.entries(p).map(([key, P]) => [
			uncapitalize(key),
			(o: any) => new P(t, o)
		])
	) as unknown as {
		[K in keyof P as K extends string ? Uncapitalize<K> : never]: (
			(o: ConstructorParameters<P[K]>[1]) =>
				InstanceType<P[K]>
		)
	}
}

