
import {Serializable} from "./types.js"

export abstract class Component<State extends Serializable> {
	constructor(public state: State) {}
}

