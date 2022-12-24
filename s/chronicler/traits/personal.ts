
export type Personal = {

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

	cognition: {
		intelligence: number
		wisdom: number
	}

	bipedal: {
		height: number
	}

	mood: {
		happiness: number
		stress: number
		confidence: number
		stoicism: number
	}
}
