
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
import {quat} from "../tools/math/quat.js"
import {force_system} from "./ecs/systems/force.js"
import {lighting_system} from "./ecs/systems/hemi.js"
import {Realm, makeRealm} from "./models/realm/realm.js"
import {governor_system} from "./ecs/systems/governor.js"
import {humanoid_system} from "./ecs/systems/humanoid.js"
import {freelook_system} from "./ecs/systems/freelook.js"
import {spectator_system} from "./ecs/systems/spectator.js"
import {intention_system} from "./ecs/systems/intention.js"
import {environment_system} from "./ecs/systems/environment.js"
import {choreography_system} from "./ecs/systems/choreography.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"
import {velocity_calculator_system} from "./ecs/systems/velocity_calculator.js"
import {physics_dynamic_system, physics_fixed_system} from "./ecs/systems/physics.js"
import { HumanoidTick } from "./ecs/house.js"
import { scalar } from "../tools/math/scalar.js"

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

const realm = await nexus.context.realmOp.load(
	async() => makeRealm({
		tickrate: 60,
		glb_links: {
			// gym: "/temp/gym13.glb",
			// character: "/temp/knightanimations19.glb",

			gym: "https://filebin.net/l4csjluwubkar8fz/gym13.glb",
			character: "https://filebin.net/djmvhh1pq40t6uyk/knightanimations19.glb",
		},
	})
)

realm.porthole.resolution = 1

const {spawn} = realm
spawn.environment("gym")
spawn.hemi({direction: [.234, 1, .123], intensity: .6})
spawn.physicsBox({
	density: 1000,
	position: [0, 5, 2],
	scale: [1, 1, 1],
	rotation: quat.identity(),
})

const executor = new Core.Executor<Realm, HumanoidTick>(
	realm,
	[
		governor_system,
		intention_system,
		force_system,
		freelook_system,
		environment_system,
		lighting_system,
		physics_fixed_system,
		physics_dynamic_system,
		spectator_system,
		humanoid_system,
		velocity_calculator_system,
		choreography_system,
	],
)

let count = 0
let last_time = performance.now()

realm.stage.remote.onTick(() => {
	realm.physics.step()
	const last = last_time
	executor.tick({
		tick: count++,
		deltaTime: scalar.clamp(
			((last_time = performance.now()) - last),
			0,
			100, // clamp to 100ms delta to avoid large over-corrections
		)/ 1000,
	})
})

realm.stage.remote.start()

console.log("realm", realm)

