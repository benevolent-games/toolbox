
import {Stage} from "../../../stage/stage.js"
import {Physics} from "../../../rapier/physics.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {Porthole} from "../../../common/models/porthole/porthole.js"
import {DebugColors, debug_colors} from "../../../tools/debug_colors.js"
import {CharacterContainer} from "../../../dance-studio/models/loader/character/container.js"

export interface HumanoidContainers {
	gym: AssetContainer
	character: CharacterContainer
}

export interface Realm {
	stage: Stage
	porthole: Porthole
	physics: Physics
	colors: DebugColors
	containers: HumanoidContainers
	impulse: HumanoidImpulse
}

export async function makeRealm({glb_links}: {
		glb_links: {
			gym: string
			character: string
		},
	}): Promise<Realm> {

	const porthole = new Porthole()

	const stage = new Stage({
		canvas: porthole.canvas,
		background: Stage.backgrounds.sky(),
	})

	const impulse = new HumanoidImpulse()

	const colors = debug_colors(stage.scene)

	const physics = new Physics({
		hz: 60,
		colors,
		scene: stage.scene,
		gravity: [0, -9.81, 0],
	})

	const [gym, character] = await Promise.all([
		stage.load_glb(glb_links.gym),
		stage.load_glb(glb_links.character)
			.then(container => new CharacterContainer(container)),
	])

	for (const light of gym.lights)
		light.intensity /= 1000

	return {
		porthole,
		stage,
		colors,
		impulse,
		physics,
		containers: {gym, character},
	}
}

