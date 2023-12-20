
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {BlueprintToAnims} from "./types.js"
import {anim_blueprint} from "./anim_blueprint.js"
import {Vec3} from "../../../../tools/math/vec3.js"
import {Disposable} from "../../../../tools/disposable.js"
import {babylonian} from "../../../../tools/math/babylonian.js"
import {process_original_animations} from "./utils/process_original_animations.js"

export class CharacterInstance extends Disposable {
	root: TransformNode
	anims: BlueprintToAnims<typeof anim_blueprint>

	get position() {
		return babylonian.to.vec3(this.root.position)
	}

	set position(v: Vec3) {
		this.root.position.set(...v)
	}

	constructor(container: AssetContainer, position: Vec3) {
		super()

		const process_cloned_animations = process_original_animations(
			container.animationGroups,
			anim_blueprint,
		)

		const instanced = container.instantiateModelsToScene()
		const [__root__] = instanced.rootNodes
		const root = __root__.getChildren()[0] as TransformNode
		root.position = babylonian.from.vec3(position)

		this.root = root
		this.anims = process_cloned_animations(instanced.animationGroups)
		this.disposable(() => instanced.dispose())
	}
}

