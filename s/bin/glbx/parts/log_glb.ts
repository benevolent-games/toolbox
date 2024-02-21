
import {basename} from "path"
import {human} from "../../../tools/human.js"

export function log_glb({path, binary}: {path: string, binary: Uint8Array}) {
	console.log(basename(path), "::", human.bytes(binary.byteLength))
}

