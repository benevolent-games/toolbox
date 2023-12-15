
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Animations/index.js"

import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"

import {register_to_dom} from "@benev/slate"

import {nexus} from "./nexus.js"
import {Realm} from "./models/realm/realm.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"

import {Core} from "../core/core.js"
import {HumanoidSchema} from "./ecs/schema.js"
import {modelSystem} from "./ecs/systems/model/system.js"
import {lightSystem} from "./ecs/systems/light/system.js"

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

const realm = await nexus.context.realmOp.load(
	async() => Realm.make({
		glb_links: {
			gym: "/temp/gym.glb",
			character: "/temp/bungledanimations18.glb",

			// gym: "https://filebin.net/42013ycnu1eav4h6/gym.glb",
			// character: "https://filebin.net/yuuj502md0iwfxrn/bungledanimations18.glb",
		},
	})
)

const entities = new Core.Entities<HumanoidSchema>()

entities.create({model: {container: "gym"}})
entities.create({light: {
	type: "hemi",
	direction: [0.234, 1, 0.123],
	intensity: 0.5,
}})

const executor = new Core.Executor({
	entities,
	realm,
}, [
	lightSystem,
	modelSystem,
])

let count = 0
realm.plate.onTick(() => executor.tick({tick: count++}))

console.log("realm", realm)

