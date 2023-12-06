
import {ArchetypeOptions} from "../types/archetype-options.js"

export function archetype<C extends {}>() {
	return function<
			F extends (o: ArchetypeOptions) => (...args: any[]) => Partial<C>
		>(fun: F) {

		return fun
	}
}
