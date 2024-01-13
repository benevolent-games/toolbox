
import {Core} from "../../../core/core.js"
import {Stage} from "../../../stage/stage.js"
import {spawners} from "../../ecs/spawners.js"
import {MeshStore} from "./parts/mesh_store.js"
import {Physics} from "../../../rapier/physics.js"
import {HumanoidSchema} from "../../ecs/schema.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {debug_colors} from "../../../tools/debug_colors.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {Porthole} from "../../../common/models/porthole/porthole.js"
import {CharacterContainer} from "../../../dance-studio/models/loader/character/container.js"

export type Realm = Awaited<ReturnType<typeof makeRealm>>

export type HumanoidContainers = {
	gym: AssetContainer
	character: AssetContainer
}

export async function makeRealm({tickrate, glb_links}: {
		tickrate: number
		glb_links: {
			gym: string
			character: string
		},
	}) {

	const impulse = new HumanoidImpulse()

	const porthole = new Porthole()
	const stage = new Stage({
		canvas: porthole.canvas,
		background: Stage.backgrounds.sky(),
		tickrate,
	})
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

	const entities = new Core.Entities<HumanoidSchema>()

	return {
		tickrate,
		porthole,
		stage,
		colors,
		impulse,
		physics,
		entities,
		spawn: spawners(entities),
		meshStore: new MeshStore(),
		containers: {gym, character},
	}
}

