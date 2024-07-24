
import {Scene} from "@babylonjs/core/scene.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"

import {fix_animation_groups} from "./fix_animation_groups.js"

/**
 * if exporting from blender, use "standard" lighting mode (instead of "unitless" or "raw")
 */
export async function loadGlb(scene: Scene, url: string, applyFixes = true) {
	const container = await SceneLoader.LoadAssetContainerAsync(
		url,
		undefined,
		scene,
		() => {},
		".glb",
	)

	container.removeAllFromScene()

	if (applyFixes)
		fix_animation_groups(container.animationGroups)

	return container
}

