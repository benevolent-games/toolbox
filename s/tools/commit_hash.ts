
export class CommitHash {
	static parse_from_dom() {
		return new this(
			document.head
				.querySelector("[data-commit-hash]")!
				.getAttribute("data-commit-hash")!
				.trim()
		)
	}

	constructor(public hash: string) {}

	get short() {
		return this.hash.slice(0, 8)
	}

	augment(link: string) {
		const {origin, pathname, searchParams, hash} = new URL(link, location.href)
		searchParams.set("commit", this.short)

		return [
			origin,
			pathname,
			"?" + searchParams.toString(),
			hash,
		].join("")
	}
}

