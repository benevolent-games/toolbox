
import {Scene} from "@babylonjs/core/scene.js"
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader.js"
import {fix_animation_groups} from "../../dance-studio/models/loader/character/utils/fix_animation_groups"

export function make_load_glb_fn(scene: Scene) {
	return async function load_glb(url: string) {
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
}

