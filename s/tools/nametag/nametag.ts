
/** nametag parsing/construction utility. see docs at the `Nametag` class. */
export const nametag = (namestring: string) => new Nametag(namestring)

/**
 * nametag parsing and construction utility.
 *
 * artists use nametags to stuff meta-information into the name strings for glb meshes, materials, etc.
 *
 * - `Nametag` extend `Map`, so you can use get/set/clear methods, and iterator methods like `entries`, `keys`, and `values`.
 * - the reason meta exists, is that blender auto-suffixes names with these `.123` numbers, so we simply parse this out so it can be safely ignored.
 * - whitespace is trimmed off the name, meta, and each tag
 *
 * anatomy of a nametag:
 *
 * 	foliage::ghost::lod=2.001
 * 	[  ↑  ][  ↑  ][  ↑  ][↑ ]
 * 	 name    tag    tag  meta
 *
 * usage example:
 *
 * 	const tag = new Nametag(`foliage::ghost::lod=2.001`)
 *
 * 	tag.name // "foliage"
 * 	tag.get("ghost") // true
 * 	tag.get("lod") // "2"
 * 	tag.get("unknown") // undefined
 * 	tag.meta // "001"
 *
 * 	tag.toString() // "foliage::ghost::lod=2.001"
 */
export class Nametag extends Map<string, string | true> {
	name: string
	meta: string | null

	constructor(namestring: string) {
		super()

		const [before, meta] = Nametag.#parse_meta(namestring)
		const [name, params] = Nametag.#parse_params(before)

		this.name = name.trim()
		this.meta = meta ? meta.trim() : meta

		for (const [paramName, paramValue] of params)
			this.set(
				paramName.trim(),
				(typeof paramValue === "string")
					? paramValue.trim()
					: paramValue,
			)
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

