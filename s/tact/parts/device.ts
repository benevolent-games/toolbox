
import {Input} from "../types/input.js"
import {pubsub} from "../../tools/pubsub.js"

export abstract class Device {
	onInput = pubsub<[Input.Whatever]>()
	abstract dispose: () => void
}

