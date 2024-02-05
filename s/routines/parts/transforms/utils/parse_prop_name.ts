
const pattern = /^(.+?)(?:#(\d+))?(?:(:.+))?$/

export type PropName = {
	basename: string
	lod: number | undefined
	directives: string | undefined
}

export function parse_prop_name(name: string) {
	const match = name.match(pattern)
	if (match)
		return {
			basename: match[1],
			lod: match[2]
				? parseInt(match[2], 10)
				: undefined,
			directives: match[3] || undefined,
		}
	else
		throw new Error(`invalid prop "${name}"`)
}

