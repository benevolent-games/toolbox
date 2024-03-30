
import {Id} from "../../tools/id.js"
import {Serializable} from "./types.js"

export abstract class Component<State extends Serializable = Serializable> {
	constructor(public readonly entityId: Id, public state: State) {}
}

