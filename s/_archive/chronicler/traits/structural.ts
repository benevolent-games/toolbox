
export type Structural = {

	structure: {
		integrity: number
		strength: number
	}

	indoors: {
		occupants: number[]
	}

	shelter: {
		residents: number[]
		capacity: number
	}

	buildingPlan: {
		wood: number
		labor: number
	}
}
