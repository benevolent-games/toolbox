
import {Actor, Transform} from "./types.js"
import {quat, vec3} from "../../../math/exports.js"

export function applyTransform(actor: Actor, transform: Transform) {
	actor.setTranslation(vec3.to.xyz(transform.position), true)
	actor.setTranslation(quat.to.xyzw(transform.rotation), true)
}

