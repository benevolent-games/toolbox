
import {clone, flat, ob} from "@benev/slate"

import {Stage} from "../../../../../stage/stage.js"
import {Rendering} from "../../../../../stage/rendering/rendering.js"
import {Effects} from "../../../../../stage/rendering/effects/types.js"

export class EffectsActuator {
	effects: Effects
	active: {[K in keyof Effects]: boolean}

	constructor(public stage: Stage) {
		const flats = this.#establish_flatstates()
		this.effects = flats.effects
		this.active = flats.active
	}

	get effectsData() {
		const copy = clone(this.effects) as Partial<Effects>
		for (const [key, value] of Object.entries(this.active))
			if (value === false)
				delete copy[key as keyof typeof copy]
		return copy
	}

	set effectsData(newEffects: Partial<Effects>) {
		for (const [k, group] of Object.entries(newEffects)) {
			const key = k as keyof Effects
			this.active[key] = !!group
			if (group)
				Object.assign(this.effects[key], group)
		}
		Object.assign(this.effects, newEffects)
	}

	#establish_flatstates() {
		const standard = Rendering.effects.everything()
		const current = this.stage.rendering.effects

		const effects = ob(standard)
			.map((effect, key) => {
				if (current && key in current && current[key])
					Object.assign(effect, current[key])
				return flat.state(effect)
			}) as Effects

		const active = flat.state(
			ob(standard).map((_effect, key) => !!(current && key in current && current[key]))
		)

		return {effects, active}
	}
}

