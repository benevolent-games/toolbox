
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Animations/index.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Physics/physicsEngineComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"

import {register_to_dom} from "@benev/slate"

// import {NetworkSession} from "./network/session.js"
// import {network_connect} from "./network/connect.js"
// import {parse_network_target_from_url} from "./network/target.js"

import {nexus} from "./nexus.js"
import {Core} from "../core/core.js"
import {spawners} from "./ecs/spawners.js"
import {Realm} from "./models/realm/realm.js"
import {hemiSystem} from "./ecs/systems/hemi.js"
import {Base, Tick, house} from "./ecs/house.js"
import {humanoidSystem} from "./ecs/systems/humanoid.js"
import {spectatorSystem} from "./ecs/systems/spectator.js"
import {physicsBoxSystem} from "./ecs/systems/physics_box.js"
import {environmentSystem} from "./ecs/systems/environment.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"
import { quat } from "../tools/math/quat.js"

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

const realm = await nexus.context.realmOp.load(
	async() => Realm.make({
		glb_links: {
			gym: "/temp/gym.glb",
			character: "/temp/knightanimations14.glb",

			// gym: "https://filebin.net/42013ycnu1eav4h6/gym.glb",
			// character: "https://filebin.net/yuuj502md0iwfxrn/bungledanimations18.glb",
		},
	})
)

// const network = {
// 	target: parse_network_target_from_url(window.location.href),
// 	sessionOp: signals.op<NetworkSession>(),
// }

// nexus.context.network = network

// network.sessionOp.load(async() =>
// 	network_connect(network.target)
// )

// if (network.target.type === "host") {
// }

house.entities.create({
	environment: {name: "gym"},
})

house.entities.create({hemi: {
	direction: [0.234, 1, 0.123],
	intensity: 0.6,
}})

spawners.spectator({position: [0, 1, -2]})
// spawners.humanoid({position: [0, 1, 0]})
spawners.physicsBox({
	density: 1,
	position: [0, 1, 3],
	rotation: quat.identity(),
	scale: [1, 1, 1],
})

const executor = new Core.Executor<Base, Tick>(
	{realm, entities: house.entities},
	[
		hemiSystem,
		environmentSystem,
		spectatorSystem,
		humanoidSystem,
		physicsBoxSystem,
	],
)

let count = 0
realm.plate.onTick(() => {
	executor.tick({tick: count++})
	realm.physics.step()
})

console.log("realm", realm)

