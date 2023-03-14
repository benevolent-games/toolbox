
import {V2, v2} from "../../utils/v2.js"
import {EffectReports, NubDetail} from "@benev/nubs"

export function walker({
		walk, sprint, key, moveVector
	}: {
		walk: number
		sprint: number
		key: EffectReports<NubDetail.Key>
		moveVector: V2 | undefined
	}) {

	function cap(vector: V2) {
		const magnitude = v2.magnitude(vector)
		return (magnitude > 1)
			? v2.normalize(vector)
			: vector
	}

	function getKeyboardForce() {
		let stride = 0
		let strafe = 0
		if (key.forward?.pressed) stride += 1
		if (key.backward?.pressed) stride -= 1
		if (key.leftward?.pressed) strafe -= 1
		if (key.rightward?.pressed) strafe += 1
		const capped = cap([strafe, stride])
		return v2.multiplyBy(capped, walk)
	}

	function getThumbForce() {
		let stride = 0
		let strafe = 0
		if(moveVector){
			stride += moveVector[1]
			strafe += moveVector[0]
		}
		const capped = cap([strafe, stride])
		return v2.multiplyBy(capped, sprint)
	}

	function getForce() {
		const keyforce = getKeyboardForce()
		const thumbforce = getThumbForce()
		return v2.add(keyforce, thumbforce)
	}

	function capTopSpeed(force: V2) {
		const magnitude = v2.magnitude(force)
		return (magnitude > sprint)
			? v2.multiplyBy(v2.normalize(force), sprint)
			: force
	}

	return {
		getForce,
		capTopSpeed,
	}
}
