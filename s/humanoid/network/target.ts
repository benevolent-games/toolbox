
export type NetworkTarget = NetworkHostTarget | NetworkClientTarget

export type NetworkHostTarget = {
	type: "host"
	label: string
}

export type NetworkClientTarget = {
	type: "client"
	sessionId: string
}

export function parse_network_target_from_url(url: string): NetworkTarget {
	const {hash} = new URL(url)
	const clientMatch = hash.match(/^#?invite=(.*)[$\&,]/i)
	const hostMatch = hash.match(/^#?label=(.*)[$\&,]/i)

	return (clientMatch
		? {
			type: "client",
			sessionId: clientMatch[1]
		}
		: {
			type: "host",
			label: hostMatch
				? hostMatch[1]
				: "game"
		}
	)
}

