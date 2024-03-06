
import {Scene} from "@babylonjs/core/scene.js"

import {Rapier} from "./rapier.js"
import {Vec3} from "../math/vec3.js"
import {vec3} from "../math/exports.js"
import * as pairs from "./pairs/pairs.js"
import {Grouping} from "./parts/grouping.js"
import * as presets from "./presets/presets.js"
import {PhysicsBonding} from "./parts/bonding.js"
import {instantiators} from "./parts/instantiators.js"

export class Physics {
	static readonly Grouping = Grouping
	readonly scene: Scene
	readonly world: Rapier.World
	readonly bonding: PhysicsBonding
	readonly pairs = instantiators(this, pairs)
	readonly presets = instantiators(this, presets)

	constructor(o: {scene: Scene, gravity: Vec3, hertz: number}) {
		this.scene = o.scene
		this.world = new Rapier.World(vec3.to.xyz(o.gravity))
		this.world.timestep = 1 / o.hertz
		this.bonding = new PhysicsBonding()
	}

	step() {
		this.world.step()
		this.bonding.synchronize()
	}
}

