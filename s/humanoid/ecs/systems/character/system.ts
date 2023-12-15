
// import {maptool} from "@benev/slate"

// import {systematize} from "../../system.js"
// import {Core} from "../../../../core/core.js"
// import {Vec3} from "../../../../tools/math/vec3.js"
// import {Choreographer} from "../../../../dance-studio/models/loader/choreographer/choreographer.js"
// import {CharacterInstance} from "../../../../dance-studio/models/loader/character/character_instance.js"

// export type HumanoidCharacter = {
// 	instance: CharacterInstance
// 	choreographer: Choreographer
// }

// export const characterSystem = systematize("character", ({entities, containers}) => {
// 	const characters = new Map<Core.Id, HumanoidCharacter>

// 	const selection = () => entities.select("character", "position")

// 	const obtain = (id: Core.Id, position: Vec3) => {
// 		return maptool(characters).guarantee(id, () => {
// 			const instance = new CharacterInstance(containers.character, position)
// 			const choreographer = new Choreographer(instance)
// 			return {instance, choreographer}
// 		})
// 	}

// 	return () => {
// 		for (const [id, {position}] of selection()) {
// 			const character = obtain(id, position)
// 			character.instance.position = position
// 		}

// 		for (const id of [...characters.keys()])
// 			if (!entities.get(id))
// 				characters.delete(id)
// 	}
// })

