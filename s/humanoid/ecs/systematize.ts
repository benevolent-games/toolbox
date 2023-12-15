
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Core} from "../../core/core.js"
import {HumanoidSchema} from "./schema.js"
import {Realm} from "../models/realm/realm.js"

export type Containers = {
	gym: AssetContainer
	character: AssetContainer
}

export type Base = {
	entities: Core.Entities<HumanoidSchema>
	realm: Realm
}

export type Tick = {
	tick: number
}

export const systematize = Core.configure_systems<Base, Tick>()

