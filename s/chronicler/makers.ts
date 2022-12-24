
import {Components} from "./components.js"
import {Randomly} from "../utils/randomly.js"
import {nomenclature} from "../utils/nomenclature.js"

export function makers(randomly: Randomly) {
	const {random} = randomly
	const {birthname, nickname} = nomenclature(random)

	return {

		tree: () => ({
			exploitable: {
				wood: 11 + Math.floor(random() * 10),
			},
			structure: {
				integrity: 1,
				strength: 0.8,
			},
			choppable: {
				integrity: 1,
			},
		}),

		well: () => ({
			unlimited: {
				water: true,
			},
			structure: {
				integrity: 1,
				strength: 0.9,
			},
		}),

		berries: () => ({
			exploitable: {
				food: 0.5,
			},
		}),

		hut: () => ({
			shelter: {
				occupants: [],
				residents: [],
			},
			structure: {
				integrity: 1,
				strength: 0.5,
			},
			flammable: {
				fire: 0,
				fuel: 1,
				burned: 0,
			},
		}),

		person: () => ({
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
		}),

	} satisfies {[key: string]: () => Partial<Components>}
}
