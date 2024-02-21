
export function args() {
	const [,, indir, outdir, verbose] = process.argv

	if (!indir)
		throw new Error("indir parameter missing")

	if (!outdir)
		throw new Error("outdir parameter missing")

	return {indir, outdir, verbose}
}

