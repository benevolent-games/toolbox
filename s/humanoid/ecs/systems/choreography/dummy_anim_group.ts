
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Animation} from "@babylonjs/core/Animations/animation.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {label} from "../../../../tools/labeler.js"

export function make_dummy_anim_group({scene, frames, framerate}: {
		scene: Scene
		frames: number
		framerate: number
	}) {

	const mesh = new Mesh(label("dummyAnimMesh"), scene)
	mesh.isVisible = false

	const group = new AnimationGroup(label("dummyAnimGroup"), scene, 1.0, 0)

	const anim = new Animation(
		label("dummyAnim"),
		"position.x",
		framerate,
		Animation.ANIMATIONTYPE_FLOAT,
		Animation.ANIMATIONLOOPMODE_CYCLE,
	)

	anim.setKeys([
		{frame: 0, value: 0},
		{frame: frames, value: 0},
	])

	mesh.animations.push(anim)
	group.addTargetedAnimation(anim, mesh)

	return group
}

