
export const nametag = (namestring: string) => new Nametag(namestring)

export class Nametag extends Map<string, string | true> {
	name: string
	meta: string | null

	constructor(namestring: string) {
		super()

		const [before, meta] = Nametag.#parse_meta(namestring)
		const [name, params] = Nametag.#parse_params(before)

		this.name = name
		this.meta = meta

		for (const [paramName, paramValue] of params)
			this.set(paramName, paramValue)
	}

	toString() {
		let namestring = `${this.name}`

		for (const [paramName, paramValue] of this.entries())
			namestring += (paramValue === true || paramValue === "")
				? `::${paramName}`
				: `::${paramName}=${paramValue}`

		if (this.meta)
			namestring += `.${this.meta}`

		return namestring
	}

	static #parse_meta(namestring: string): [string, string | null] {
		if (namestring.includes(".")) {
			const parts = namestring.split(".")
			const [before, ...after] = parts
			const meta = after.join(".")
			return [before, meta]
		}
		else return [namestring, null]
	}

	static #parse_params(alpha: string): [string, [string, string | true][]] {
		if (alpha.includes("::")) {
			const parts = alpha.split("::")
			const [beta, ...paramBodies] = parts
			const params = paramBodies
				.map((paramBody): null | [string, string | true] => {
					if (!paramBody)
						return null
					if (paramBody.includes("=")) {
						const [paramName, ...valuechunks] = paramBody.split("=")
						return paramName
							? [paramName, valuechunks.join("=") || true]
							: null
					}
					else return [paramBody, true]
				})
				.filter(t => t !== null) as [string, string | true][]
			return [beta, params]
		}
		else return [alpha, []]
	}
}

