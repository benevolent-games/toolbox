
export const nametag = (namestring: string) => new Nametag(namestring)

export class Nametag extends Map<string, string | null> {
	name: string
	meta: string | null

	constructor(namestring: string) {
		super()

		const [before, meta] = Nametag.#parse_meta(namestring)
		const [name, tags] = Nametag.#parse_tags(before)

		this.name = name
		this.meta = meta

		for (const [tagName, tagValue] of tags)
			this.set(tagName, tagValue)
	}

	toString() {
		let namestring = `${this.name}`

		for (const [tagName, tagValue] of this.entries())
			namestring += tagValue
				? `::${tagName}=${tagValue}`
				: `::${tagName}`

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

	static #parse_tags(alpha: string): [string, [string, string | null][]] {
		if (alpha.includes("::")) {
			const parts = alpha.split("::")
			const [beta, ...tagBodies] = parts
			const tags = tagBodies
				.map((tagBody): null | [string, string | null] => {
					if (!tagBody)
						return null
					if (tagBody.includes("=")) {
						const [tagName, ...valuechunks] = tagBody.split("=")
						return tagName
							? [tagName, valuechunks.join("=")]
							: null
					}
					else return [tagBody, null]
				})
				.filter(t => t !== null) as [string, string | null][]
			return [beta, tags]
		}
		else return [alpha, []]
	}
}

