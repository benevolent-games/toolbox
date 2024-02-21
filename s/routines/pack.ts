#!/usr/bin/env node

import {glob} from "glob"
import {dedup} from "@gltf-transform/functions"
import {join, relative, resolve, parse} from "path"

import {args} from "./parts/args.js"
import {tiers} from "./parts/tiers.js"
import {glb_io} from "./parts/glb_io.js"
import {log_glb} from "./parts/log_glb.js"

const {indir, outdir, verbose} = args()
const inpattern = `${indir}/**/*.glb`

for (const inpath of await glob(inpattern, {nodir: true})) {
	const {dir, name} = parse(relative(resolve(indir), inpath))
	const outpath = (index: number) => join(outdir, `${dir}/${name}.${index}.glb`)

	const gio = await glb_io()
	const original = await gio.read(inpath)

	log_glb(original)
	await original.document.transform(dedup())

	for (const [index, [,transforms]] of tiers.entries()) {
		const document = original.document.clone()
		await document.transform(...transforms)
		const report = await gio.write(outpath(index), document)

		log_glb(report)

		if (!!verbose && index === 0) {
			for (const node of document.getRoot().listNodes()) {
				console.log(` - ${node.getName()}`)
			}
		}
	}
}

