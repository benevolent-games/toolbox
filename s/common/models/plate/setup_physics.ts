
import {Scene} from "@babylonjs/core/scene.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import HavokPhysics from "@babylonjs/havok/lib/esm/HavokPhysics_es.js"
import {HavokPlugin} from "@babylonjs/core/Physics/v2/Plugins/havokPlugin.js"

export type PlatePhysics = Awaited<ReturnType<typeof setup_physics>>

export async function setup_physics(scene: Scene) {
	const gravity = new Vector3(0, -9.81, 0)
	const plugin = new HavokPlugin(true, await HavokPhysics())
	scene.enablePhysics(gravity, plugin)
	const engine = scene.getPhysicsEngine()!
	return {engine, plugin}
}

