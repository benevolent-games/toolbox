
import {Update} from "./update.js"

export interface Options {
	onProgress?({}: Update): void
}
