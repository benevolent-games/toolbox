
import {Scene} from "@babylonjs/core/scene.js"
import {Color4} from "@babylonjs/core/Maths/math.color.js"
import {CompatibilityOptions} from "@babylonjs/core/Compat/compatibilityOptions.js"

import {AnyEngine} from "./types.js"
import {Vec4} from "../../math/vec4.js"

export type SimpleSceneOptions = {
	engine: AnyEngine
	background: Vec4
	virtual?: boolean
}

export function make_scene({
		engine,
		background,
		virtual = false,
	}: SimpleSceneOptions) {

	const scene = new Scene(engine, {
		virtual,
		useClonedMeshMap: true,
		useMaterialMeshMap: true,
		useGeometryUniqueIdsMap: true,
	})

	CompatibilityOptions.UseOpenGLOrientationForUV = true
	scene.clearColor = new Color4(...background)
	scene.detachControl()
	scene.useRightHandedSystem = true

	return scene
}

