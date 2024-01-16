
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
import {Ecs} from "../ecs/ecs.js"
import {quat} from "../tools/math/quat.js"
import {HumanoidTick} from "./ecs/schema.js"
import {scalar} from "../tools/math/scalar.js"
import {makeRealm} from "./models/realm/realm.js"
import {Sensitivity} from "./models/impulse/types.js"
import {make_mainpipe} from "./ecs/pipelines/sketch.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"
import { log100 } from "../tools/limited_logger.js"

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

const localTesting = (
	window.location.host.startsWith("localhost") ||
	window.location.host.startsWith("192")
)

const realm = await nexus.context.realmOp.load(
	async() => makeRealm({
		tickrate: 60,
		glb_links: localTesting ? {
			gym: "/temp/gym13.glb",
			character: "/temp/knightanimations23.glb",
		} : {
			gym: "https://filebin.net/jpb4802198d8jcpx/gym13.glb",
			character: "https://filebin.net/jpb4802198d8jcpx/knightanimations23.glb",
		},
	})
)

realm.porthole.resolution = localTesting
	? 0.5
	: 1

const mainpipe = make_mainpipe(realm)
const entityCache = new Ecs.EntityCache(realm.entities, [mainpipe])

const {spawn} = realm
spawn.environment("gym")
spawn.hemi({direction: [.234, 1, .123], intensity: .6})
spawn.physicsBox({
	density: 1000,
	position: [0, 5, 2],
	scale: [1, 1, 1],
	rotation: quat.identity(),
})

{
	realm.impulse.modes.assign("universal", "humanoid")

	const sensitivity = (): Sensitivity => ({
		keys: 100 / 10_000,
		mouse: 5 / 10_000,
		stick: 100 / 10_000,
	})

	let next: () => void = () => {}

	function spectatorState() {
		const id = realm.spawn.spectator({
			position: [0, 1, -2],
			sensitivity: sensitivity(),
		})
		next = () => {
			realm.entities.delete(id)
			humanoidState()
		}
	}

	function humanoidState() {
		const id = realm.spawn.humanoid({
			debug: false,
			position: [0, 5, 0],
			sensitivity: sensitivity(),
		})
		next = () => {
			realm.entities.delete(id)
			spectatorState()
		}
	}

	humanoidState()

	realm.impulse.on.universal.buttons.respawn(input => {
		if (input.down)
			next()
	})
}

let count = 0
let last_time = performance.now()

realm.stage.remote.onTick(() => {
	realm.physics.step()
	const last = last_time
	let start = performance.now()

	const tick: HumanoidTick = {
		tick: count++,
		deltaTime: scalar.clamp(
			((last_time = performance.now()) - last),
			0,
			100, // clamp to 100ms delta to avoid large over-corrections
		) / 1000,
	}

	for (const system of mainpipe.systems) {
		const entities = [...entityCache.obtain(system)]
		system.execute(tick, entities as any)
	}

	let time = performance.now() - start
	// log100(`tick ${time.toFixed(2)} ms`)

	// executor.tick({
	// 	tick: count++,
	// 	deltaTime: scalar.clamp(
	// 		((last_time = performance.now()) - last),
	// 		0,
	// 		100, // clamp to 100ms delta to avoid large over-corrections
	// 	) / 1000,
	// })
})

realm.stage.remote.start()

console.log("realm", realm)

