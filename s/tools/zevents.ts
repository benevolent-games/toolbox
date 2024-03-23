
import {Pojo} from "@benev/slate"

export type ZListener = (...args: any[]) => void
export type ZEvents = Pojo<ZListener>

export function zevents<E extends ZEvents>(target: EventTarget, events: E) {
	const entries = Object.entries(events)

	for (const [event, listener] of entries)
		target.addEventListener(event, listener)

	return function dispose() {
		for (const [event, listener] of entries)
			target.removeEventListener(event, listener)
	}
}

