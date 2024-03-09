
import {Scene} from "@babylonjs/core/scene.js"

import {Rapier} from "./rapier.js"
import {ray} from "./utils/ray.js"
import {Vec3} from "../math/vec3.js"
import {vec3} from "../math/exports.js"
import * as prefabs from "./prefabs.js"
import {Groups} from "./parts/groups.js"
import {prefabulate} from "./utils/prefab.js"
import {PhysicsBonding} from "./parts/bonding.js"
import {DebugColors, debug_colors} from "../tools/debug_colors.js"

export class Physics {
	static readonly ray = ray

	readonly groups = Groups
	readonly prefabs = prefabulate(this, prefabs)

	readonly scene: Scene
	readonly world: Rapier.World
	readonly colors: DebugColors
	readonly bonding: PhysicsBonding

	constructor(o: {scene: Scene, gravity: Vec3, hertz: number, colors?: DebugColors}) {
		this.scene = o.scene
		this.world = new Rapier.World(vec3.to.xyz(o.gravity))
		this.world.timestep = 1 / o.hertz
		this.bonding = new PhysicsBonding()
		this.colors = o.colors ?? debug_colors(o.scene)
	}

	step() {
		this.world.step()
		this.bonding.synchronize()
	}
}

