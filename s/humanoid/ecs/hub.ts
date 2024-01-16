
import {Ecs} from "../../ecs/ecs.js"
import {HumanoidSchema} from "./schema.js"
import {Realm} from "../models/realm/realm.js"

export type ThreadBase = {}

export type Tick = {
	deltaTime: number
}

export const mainthread = new Ecs.Hub<
	Realm,
	Tick,
	HumanoidSchema
>()

export const threadable = new Ecs.Hub<
	ThreadBase,
	Tick,
	HumanoidSchema
>()

