
export type Interactive = {

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

	flammable: {
		fire: number
		fuel: number
		burned: number
	}

}
