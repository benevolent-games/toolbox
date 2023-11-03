
import {v3, V3} from "./v3.js"
import {Quat, quat} from "./quat.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

export function positionInterpolator(steps: number) {
	let goalpost = v3.zero()
	return {
		updateGoalpost(position: V3) {
			goalpost = position
		},
		getCloser(currentPosition: V3) {
			const difference = v3.subtract(goalpost, currentPosition)
			const step = v3.divideBy(difference, steps)
			return v3.add(currentPosition, step)
		},
	}
}

export function rotationInterpolator(steps: number) {
	let goalpost = quat.identity()
	return {
		updateGoalpost(rotation: Quat) {
			goalpost = rotation
		},
		getCloser(currentRotation: Quat) {
			const newRotation = Quaternion.Slerp(
				quat.toBabylon(currentRotation),
				quat.toBabylon(goalpost),
				1 / steps,
			)
			return quat.fromBabylon(newRotation)
		},
	}
}

export function scalarInterpolator(steps: number) {
	let goalpost = 0
	return {
		updateGoalpost(value: number) {
			goalpost = value
		},
		getCloser(currentValue: number) {
			const difference = goalpost - currentValue
			const step = difference / steps
			return currentValue + step
		},
	}
}
