#!/usr/bin/env node

import {join} from "path"
import {dedup} from "@gltf-transform/functions"

import {args} from "./parts/args.js"
import {tiers} from "./parts/tiers.js"
import {glb_io} from "./parts/glb_io.js"
import {log_glb} from "./parts/log_glb.js"

const {inpath, outdir, verbose} = args()
const gio = await glb_io()
const original = await gio.read(inpath)

log_glb(original)
await original.document.transform(dedup())

for (const [index, [,transforms]] of tiers.entries()) {
	const document = original.document.clone()
	await document.transform(...transforms)
	const report = await gio.write(join(outdir, `pack.${index}.glb`), document)

	log_glb(report)

	if (!!verbose && index === 0) {
		for (const node of document.getRoot().listNodes()) {
			console.log(` - ${node.getName()}`)
		}
	}
}

