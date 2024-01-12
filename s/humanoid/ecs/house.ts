
import {Core} from "../../core/core.js"
import {HumanoidSchema} from "./schema.js"
import {Realm} from "../models/realm/realm.js"

export const {system, rezzer, processor} = Core.configure_systems<
	HumanoidSchema,
	Realm,
	Core.StdTick
>()

