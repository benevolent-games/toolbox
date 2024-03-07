
import {Scene} from "@babylonjs/core/scene.js"

import {Rapier} from "./rapier.js"
import {Vec3} from "../math/vec3.js"
import {vec3} from "../math/exports.js"
import {Grouping} from "./parts/grouping.js"
import * as prefabs from "./presets/prefabs.js"
import {PhysicsBonding} from "./parts/bonding.js"
import {prefab_helpers} from "./presets/utils/prefab.js"

export class Physics {
	static readonly Grouping = Grouping
	readonly scene: Scene
	readonly world: Rapier.World
	readonly bonding: PhysicsBonding
	readonly prefabs = prefab_helpers(this, prefabs)

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

