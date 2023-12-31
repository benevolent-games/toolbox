
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {AnimationCollection} from "./types.js"
import {anim_blueprint} from "./anim_blueprint.js"
import {Vec3} from "../../../../tools/math/vec3.js"
import {Disposable} from "../../../../tools/disposable.js"
import {babylonian} from "../../../../tools/math/babylonian.js"
import {animation_association} from "./utils/animation_association.js"

export type CharacterAnimationCollection = AnimationCollection<(typeof anim_blueprint)[number]>

export class CharacterInstance extends Disposable {
	root: TransformNode
	animationCollection: CharacterAnimationCollection

	get position() {
		return babylonian.to.vec3(this.root.position)
	}

	set position(v: Vec3) {
		this.root.position.set(...v)
	}

	constructor(container: AssetContainer, position: Vec3) {
		super()

		const instanced = container.instantiateModelsToScene()

		const [__root__] = instanced.rootNodes
		const root = __root__.getChildren()[0] as TransformNode
		root.position = babylonian.from.vec3(position)
		this.root = root

		this.animationCollection = animation_association.recover(
			instanced.animationGroups,
			anim_blueprint,
		)

		this.disposable(() => instanced.dispose())
	}
}

