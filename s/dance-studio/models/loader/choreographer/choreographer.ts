
import {default_choreo_settings} from "./settings.js"
import {scalar} from "../../../../tools/math/scalar.js"
import {CharacterInstance} from "../character/instance.js"
import {setup_character_anims} from "./parts/setup_character_anims.js"
import {calculate_choreo_values} from "./parts/calculate_choreo_values.js"
import {AdjustmentAnims, AdjustmentDirection, Choreography} from "./types.js"
import {calculate_adjustment_weight} from "./parts/utils/calculate_adjustment_weight.js"
import {synchronize_character_animations} from "./parts/synchronize_character_animations.js"

export class Choreographer {
	static default_choreography(): Choreography {
		const settings = default_choreo_settings()
		return {
			settings,
			intent: {
				amble: [0, 0],
				glance: [0, 0],
			},
			gimbal: [0, 0.5],
			rotation: 0,
			ambulatory: {
				ambulation: [0, 0],
				magnitude: 0,
				stillness: 1,
				north: 0,
				west: 0,
				south: 0,
				east: 0,
			},
			swivel: settings.swivel.midpoint,
			adjustment: null,
		}
	}

	anims: ReturnType<typeof setup_character_anims>
	adjustment_anims: AdjustmentAnims

	constructor(public character: CharacterInstance) {
		this.anims = setup_character_anims(character)
		console.log("anims", this.anims)
		// console.log(character.anims.spine_tilt_forwardsbackwards.group)
		this.adjustment_anims = {
			start: ({direction}) => {
				// const anim = adjustment_anim_for_direction(character, direction)
				// anim.play(false)
				// anim.pause()
			},
			stop: () => {
				// // TODO
				// character.anims.legs_stand_adjust_left.stop()
				// character.anims.legs_stand_adjust_right.stop()
			},
			update: ({direction, progress}) => {
				// const anim = adjustment_anim_for_direction(character, direction)
				// const frame = scalar.map(progress, [
				// 	anim.from,
				// 	anim.to,
				// ])
				// anim.weight = calculate_adjustment_weight(progress)
				// anim.goToFrame(frame)
			},
		}
	}

	update(original: Choreography) {
		const choreo = calculate_choreo_values(
			original,
			this.adjustment_anims,
		)
		synchronize_character_animations(
			choreo,
			this.anims,
			this.adjustment_anims,
		)
		return choreo
	}
}

/////////////////////////////////
/////////////////////////////////

function adjustment_anim_for_direction(
		character: CharacterInstance,
		direction: AdjustmentDirection,
	) {
	return null
	// return direction === "left"
	// 	? character.anims.legs_stand_adjust_left
	// 	: character.anims.legs_stand_adjust_right
}

