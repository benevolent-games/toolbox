
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Core} from "../../core/core.js"
import {HumanoidSchema} from "./schema.js"
import {Realm} from "../models/realm/realm.js"
import {Rezzers} from "./specials/babylon_reify/rezzers.js"

export type Containers = {
	gym: AssetContainer
	character: AssetContainer
}

export type Base = {
	entities: Core.Entities<HumanoidSchema>
	realm: Realm
	rezzers: Rezzers
}

export type Tick = {
	tick: number
}

export const systematize = Core.configure_systems<Base, Tick>()

