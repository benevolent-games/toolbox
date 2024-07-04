
import {Scene} from "@babylonjs/core/scene.js"
import {Color4} from "@babylonjs/core/Maths/math.color.js"
import {CompatibilityOptions} from "@babylonjs/core/Compat/compatibilityOptions.js"

import {Vec3} from "../math/vec3.js"
import {FlexCanvas} from "./parts/flex-canvas.js"
import {start_engine} from "./parts/start-engine.js"
import {AnyEngine, VistaOptions} from "./parts/types.js"

/**
 * create a 3d world in babylonjs.
 *  - handles a bunch of silly boilerplate automatically for you.
 *  - can use webgpu instead of webgl if you allow it.
 *  - switches babylon to use opengl standards instead of directx.
 *  - has handy facilities, for loading glbs, managing cameras, postpro effects, etc.
 */
export class Vista {
	readonly engine: AnyEngine
	readonly canvas: FlexCanvas

	static engine = start_engine

	constructor(o: VistaOptions) {
		this.engine = o.engine
		this.canvas = new FlexCanvas(o.canvas)
	}

	makeScene(o: {
			background: Vec3
			virtual?: boolean
		}) {

		const scene = new Scene(this.engine, {
			virtual: o.virtual,
			useClonedMeshMap: true,
			useMaterialMeshMap: true,
			useGeometryUniqueIdsMap: true,
		})

		scene.clearColor = new Color4(...o.background)
		scene.detachControl()
		scene.useRightHandedSystem = true
		CompatibilityOptions.UseOpenGLOrientationForUV = true

		return scene
	}

	dispose() {}
}

