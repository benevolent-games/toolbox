
import {Actor, Transform} from "./types.js"
import {quat, vec3} from "../../math/exports.js"

export function applyTransform(actor: Actor, transform: Partial<Transform>) {
	actor.setTranslation(vec3.to.xyz(transform.position ?? vec3.zero()), true)
	actor.setRotation(quat.to.xyzw(transform.rotation ?? quat.identity()), true)
}

