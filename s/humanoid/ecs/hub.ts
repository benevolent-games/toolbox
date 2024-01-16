
import {Ecs} from "../../ecs/ecs.js"
import {Realm} from "../models/realm/realm.js"
import {HumanoidSchema, HumanoidTick} from "./schema.js"

export type ThreadBase = {}

export const mainthread = new Ecs.Hub<
	Realm,
	HumanoidTick,
	HumanoidSchema
>()

export const threadable = new Ecs.Hub<
	ThreadBase,
	HumanoidTick,
	HumanoidSchema
>()

