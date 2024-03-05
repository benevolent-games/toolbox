
import {Scene} from "@babylonjs/core/scene.js"

import {Rapier} from "./rapier.js"
import {Vec3} from "../math/vec3.js"
import {vec3} from "../math/exports.js"
import {Grouping} from "./parts/grouping.js"
import {PhysicsPresets} from "./parts/presets.js"
import {PhysicsBonding} from "./parts/bonding.js"
import {PhysicsColliders} from "./parts/colliders.js"

export class Physics {
	static readonly Grouping = Grouping
	readonly world: Rapier.World
	readonly bonding: PhysicsBonding
	readonly colliders: PhysicsColliders
	readonly presets: PhysicsPresets

	constructor(o: {scene: Scene, gravity: Vec3, hertz: number}) {
		this.world = new Rapier.World(vec3.to.xyz(o.gravity))
		this.world.timestep = 1 / o.hertz

		this.bonding = new PhysicsBonding()
		this.colliders = new PhysicsColliders(this.world, o.scene)
		this.presets = new PhysicsPresets(this.world, this.bonding, this.colliders)
	}

	step() {
		this.world.step()
		this.bonding.synchronize()
	}
}

