
const syllableStarts = [
	"r",
	"rh",
	"ry",
	"h",
	"hy",
	"hr",
	"hr",
	"t",
	"tr",
	"tyr",
	"twy",
	"thy",
	"thys",
	"wr",
	"wy",
	"g",
	"gy",
	"gr",
	"gh",
	"gyh",
	"gry",
	"gryh",
	"vy",
	"vr",
	"vyr",
	"wyr",
	"myr",
]

const syllableMiddles = [
	"agg",
	"egg",
	"ack",
	"eck",
	"agry",
	"egh",
	"end",
	"ign",
	"inn",
	"iyn",
	"iym",
	"af",
	"ef",
	"efg",
	"eyg",
	"ayg",
	"ehg",
	"ygg",
	"uyg",
	"aygh",
	"orm",
	"org",
]

const syllableEnds = [
	"ag",
	"ug",
	"eyg",
	"ugh",
	"egh",
	"im",
	"iym",
	"am",
	"ag",
	"ecken",
	"acken",
	"ettle",
	"attle",
	"irm",
	"imn",
	"on",
	"own",
	"om",
	"onkle",
	"ankle",
	"angle",
	"engle",
	"ingle",
	"angal",
	"antal",
	"entel",
	"erken",
	"irken",
	"orken",
	"ongle",
	"ogon",
	"agan",
]

function capitalize(subject: string) {
	return subject.length
		? subject[0].toUpperCase() + subject.slice(1)
		: ""
}

function hatPuller<T>(random: () => number, items: T[]) {
	let hat = [...items]

	return () => {
		if (!hat.length)
			hat = [...items]

		const index = Math.floor(random() * hat.length)
		const value = hat[index]
		hat.splice(index, 1)
		return value
	}
}

export function nomenclature(random: () => number) {
	const syllable = {
		start: hatPuller(random, syllableStarts),
		middle: hatPuller(random, syllableMiddles),
		end: hatPuller(random, syllableEnds),
	}

	return {
		birthname() {
			return (
				capitalize(syllable.start()) + syllable.end()
				+ " "
				+ capitalize(syllable.start()) + syllable.middle() + syllable.end()
			)
		},
		nickname() {
			return (random() < 0.3)
				? capitalize(syllable.start()) + syllable.end()
				: ""
		},
	}
}
