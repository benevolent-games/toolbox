
export type Creature = {

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

	physicality: {
		strength: number
		agility: number
	}
}
