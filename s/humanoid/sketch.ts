
import {maptool} from "@benev/slate"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Core} from "../core/core.js"
import {Vec3} from "../tools/math/vec3.js"
import {HumanoidImpulse} from "./models/impulse/impulse.js"
import {Choreographer} from "../dance-studio/models/loader/choreographer/choreographer.js"
import {CharacterInstance} from "../dance-studio/models/loader/character/character_instance.js"

export type HumanoidSchema = Core.AsAspectSchema<{
	position: Vec3
	character: true
	controllable: true
	capsule: {
		radius: number
		height: number
	}
	physical: {
		mass: number
		restitution: number
		shape: "capsule"
	}
}>

export type SystemParams = {
	machine: Core.Machine<HumanoidSchema>
	impulse: HumanoidImpulse
	containers: {character: AssetContainer}
}

export type SystemTick = {
	tick: number
}

export type HumanoidCharacter = {
	instance: CharacterInstance
	choreographer: Choreographer
}

export const system = Core.configure_systems<SystemParams, SystemTick>()

export const characterSystem = system("character", ({machine, containers}) => {
	const characters = new Map<Core.Id, HumanoidCharacter>

	const selection = () => machine.select("character", "position")

	const obtain = (id: Core.Id, position: Vec3) => {
		return maptool(characters).guarantee(id, () => {
			const instance = new CharacterInstance(containers.character, position)
			const choreographer = new Choreographer(instance)
			return {instance, choreographer}
		})
	}

	return () => {
		for (const [{position}, id] of selection()) {
			const character = obtain(id, position)
			character.instance.position = position
		}

		for (const nodeId of [...characters.keys()])
			if (!machine.node(nodeId))
				characters.delete(nodeId)
	}
})

