
import {Scene} from "@babylonjs/core/scene.js"

import {Rapier} from "./rapier.js"
import {ray} from "./utils/ray.js"
import {vec3} from "../math/exports.js"
import * as prefabs from "./prefabs.js"
import {Grouper} from "./parts/grouper.js"
import {prefabulate} from "./utils/prefab.js"
import {PhysicsOptions} from "./utils/types.js"
import {PhysicsBonding} from "./parts/bonding.js"
import {DebugColors, debug_colors} from "../tools/debug_colors.js"

export class Physics {
	static readonly ray = ray

	readonly grouper = new Grouper()
	readonly prefabs = prefabulate(this, prefabs)

	readonly scene: Scene
	readonly world: Rapier.World
	readonly colors: DebugColors
	readonly bonding: PhysicsBonding

	#queue = new Rapier.EventQueue(true)
	collision_events: {a: number, b: number, started: boolean}[] = []
	contact_force_events: Rapier.TempContactForceEvent[] = []

	constructor(o: PhysicsOptions) {
		this.scene = o.scene
		this.world = new Rapier.World(vec3.to.xyz(o.gravity))
		this.bonding = new PhysicsBonding()
		this.colors = o.colors ?? debug_colors(o.scene)
	}

	step(seconds: number) {
		this.world.timestep = seconds
		this.world.step(this.#queue)
		this.bonding.synchronize()

		this.collision_events = []
		this.contact_force_events = []

		this.#queue.drainCollisionEvents(
			(a, b, started) => this.collision_events.push({a, b, started})
		)

		this.#queue.drainContactForceEvents(
			event => this.contact_force_events.push(event)
		)
	}
}

