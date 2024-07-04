
import {Scene} from "@babylonjs/core/scene.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"

import {fix_animation_groups} from "./fix_animation_groups.js"
import {fix_emissive_colors_by_converting_them_to_gamma_space} from "./fix_emissive_colors_by_converting_them_to_gamma_space.js"

export async function loadGlb(scene: Scene, url: string) {
	const container = await SceneLoader.LoadAssetContainerAsync(
		url,
		undefined,
		scene,
		() => {},
		".glb",
	)

	container.removeAllFromScene()

	fix_animation_groups(container.animationGroups)
	fix_emissive_colors_by_converting_them_to_gamma_space(container.materials)

	return container
}

