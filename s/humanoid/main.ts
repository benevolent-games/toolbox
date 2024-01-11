
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Animations/index.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Physics/physicsEngineComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"

import {register_to_dom} from "@benev/slate"

import {nexus} from "./nexus.js"
import {Core} from "../core/core.js"
import {Realm, makeRealm} from "./models/realm/realm.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"
import { spawners } from "./ecs/spawners.js"
import { environment_system } from "./ecs/systems/environment.js"
import { physics_fixed_system } from "./ecs/systems/physics.js"
import { spectator_system } from "./ecs/systems/spectator.js"
import { intention_system } from "./ecs/systems/intention.js"

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

const realm = await nexus.context.realmOp.load(
	async() => makeRealm({
		glb_links: {
			// gym: "/temp/gym13.glb",
			// character: "/temp/knightanimations19.glb",

			gym: "https://filebin.net/l4csjluwubkar8fz/gym13.glb",
			character: "https://filebin.net/djmvhh1pq40t6uyk/knightanimations19.glb",
		},
	})
)

realm.porthole.resolution = 1

const spawn = spawners(realm)
spawn.environment("gym")
spawn.spectator({
	position: [0, 1, -2],
	sensitivity: {
		keys: 5 / 100,
		mouse: 10 / 100,
		stick: 10 / 100,
	},
})

// house.entities.create({
// 	environment: {name: "gym"},
// })

// house.entities.create({hemi: {
// 	direction: [0.234, 1, 0.123],
// 	intensity: 0.6,
// }})

// // spawners.spectator({position: [0, 1, -2]})
// spawners.humanoid({position: [0, 5, 0], debug: false})
// spawners.physicsBox({
// 	density: 1,
// 	position: [0, 8, 3],
// 	rotation: quat.identity(),
// 	scale: [1, 1, 1],
// })

const executor = new Core.Executor<Realm, Core.StdTick>(
	realm,
	[
		intention_system,
		environment_system,
		physics_fixed_system,
		spectator_system,

		// environmentSystem,
		// intentionSystem,
		// physicsSystem,
		// spawningSystem,

		// hemiSystem,
		// environmentSystem,
		// intentionSystem,
		// spectatorSystem,
		// humanoidSystem,
		// choreographSystem,
		// physicsBoxSystem,
	],
)

let count = 0

realm.stage.remote.onTick(() => {
	realm.physics.step()
	executor.tick({tick: count++})
})

realm.stage.remote.start()

console.log("realm", realm)

