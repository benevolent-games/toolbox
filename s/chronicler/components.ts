
export type Components = {

	identity: {
		birthname: string
		nickname: string
	}

	alignment: {
		good: number
		lawful: number
	}

	personality: {
		openness: number
		conscientiousness: number
		extroversion: number
		agreeableness: number
		neuroticism: number
	}

	age: {
		years: number
	},

	cognition: {
		intelligence: number
		wisdom: number
	}

	bipedal: {
		height: number
	}

	physicality: {
		strength: number
		agility: number
	}

	location: {
		position: [number, number, number]
	}

	mood: {
		happiness: number
		stress: number
		confidence: number
		stoicism: number
	}

	biology: {
		warmth: number
		hydration: number
		nourishment: number
		oxygen: number
	}

	death: {
		cause: string
	},

	mortality: {
		heartrate: number
		blood: number
		bleed: number
	}

	money: {
		amount: number
	}

	flammable: {
		fire: number
		fuel: number
		burned: number
	}

	structure: {
		integrity: number
		strength: number
	}

	shelter: {
		occupants: number[]
		residents: number[]
	}

	choppable: {
		integrity: number
	}

	unlimited: {
		water?: true
	}

	exploitable: {
		water?: number
		food?: number
		wood?: number
	}

	buildingPlan: {
		owner: number
		wood: number
		labor: number
	}
}
