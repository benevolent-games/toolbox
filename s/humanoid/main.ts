
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Animations/index.js"

import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"

import {register_to_dom, signals} from "@benev/slate"

import {nexus} from "./nexus.js"
import {Core} from "../core/core.js"
import {Base, Tick, house} from "./ecs/house.js"
import {Realm} from "./models/realm/realm.js"
import {hemiSystem} from "./ecs/systems/hemi.js"
// import {NetworkSession} from "./network/session.js"
// import {network_connect} from "./network/connect.js"
import {spectatorSystem} from "./ecs/systems/spectator.js"
import {environmentSystem} from "./ecs/systems/environment.js"
// import {parse_network_target_from_url} from "./network/target.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"

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
	environment: {name: "gym"}
})

house.entities.create({hemi: {
	direction: [0.234, 1, 0.123],
	intensity: 0.6,
}})

house.entities.create({spectator: {
	gimbal: [0, 0],
	position: [0, 1, 0],
	speeds: {
		base: 1,
		fast: 2,
		slow: 0.2,
	},
	sensitivity: {
		keys: 0.1,
		mouse: 0.1,
		stick: 0.1,
	},
}})

const executor = new Core.Executor<Base, Tick>(
	{realm, entities: house.entities},
	[
		hemiSystem,
		environmentSystem,
		spectatorSystem,
	],
)

let count = 0
realm.plate.onTick(() => executor.tick({tick: count++}))

console.log("realm", realm)

