
import {Scene} from "@babylonjs/core/scene.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {fix_animation_groups} from "../utils/fix_animation_groups.js"

export async function load_glb(scene: Scene, url: string) {
	const container = await SceneLoader.LoadAssetContainerAsync(
		url,
		undefined,
		scene,
		() => {},
		".glb",
	)

	container.removeAllFromScene()

	if (container.animationGroups.length)
		fix_animation_groups(container.animationGroups)

	return container
}

