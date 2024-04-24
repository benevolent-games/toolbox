
import {clone, flatstate, ob} from "@benev/slate"

import {Stage} from "../../../../../stage/stage.js"
import {Rendering} from "../../../../../stage/rendering/rendering.js"
import {Effects} from "../../../../../stage/rendering/effects/types.js"
import {assignSelectively} from "../../../../../tools/assign-selectively.js"

const everything = Rendering.effects.everything()

export class EffectsStates {
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
		for (const [key, standardGroup] of Object.entries(everything)) {
			const k = key as keyof Effects
			const newGroup = newEffects[k]
			this.active[k] = !!newGroup
			if (newGroup)
				assignSelectively(standardGroup, this.effects[k], newGroup)
		}
	}

	#establish_flatstates() {
		const standard = Rendering.effects.everything()
		const current = this.stage.rendering.effects

		const effects = ob(standard)
			.map((effect, key) => {
				if (current && key in current && current[key])
					Object.assign(effect, current[key])
				return flatstate(effect)
			}) as Effects

		const active = flatstate(
			ob(standard).map((_effect, key) => !!(current && key in current && current[key]))
		)

		return {effects, active}
	}
}

