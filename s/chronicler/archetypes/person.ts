
import {Traits} from "../traits.js"
import {archetype} from "../utils/archetype.js"
import {nomenclature} from "../../utils/nomenclature.js"

export const person = archetype<Traits>()(({randomly}) => () => {
	const {random} = randomly
	const {birthname, nickname} = nomenclature(random)
	return {

		identity: {
			birthname: birthname(),
			nickname: nickname(),
		},

		alignment: {
			good: random(),
			lawful: random(),
		},

		biology: {
			hydration: random(),
			nourishment: random(),
			oxygen: 1,
			warmth: 0.5,
		},

		mood: {
			confidence: random(),
			happiness: random(),
			stoicism: random(),
			stress: random(),
		},

		physicality: {
			agility: random(),
			strength: random(),
		},

		mortality: {
			blood: 1,
			heartrate: 0.5,
			bleed: random() < 0.01
				? random() * 0.1
				: 0,
		},

		age: {
			years: 18 + random() * 100,
		},

		bipedal: {
			height: 1.5 + random() * 0.5,
		},

		cognition: {
			intelligence: random(),
			wisdom: random(),
		},

		location: {
			position: [random() * 1000, random() * 1000, 0],
		},

		money: {
			amount: random() * 100,
		},

		personality: {
			agreeableness: random(),
			conscientiousness: random(),
			extroversion: random(),
			neuroticism: random(),
			openness: random(),
		},

	}
})
