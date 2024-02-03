
export function args() {
	const [,, inpath, outdir, verbose] = process.argv

	if (!inpath)
		throw new Error("inpath parameter missing")

	if (!outdir)
		throw new Error("outdir parameter missing")

	return {inpath, outdir, verbose}
}

