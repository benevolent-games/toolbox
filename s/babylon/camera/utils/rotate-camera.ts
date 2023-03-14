import {V2} from "../../../utils/v2.js"

export function rotateCamera({addMouseforce, movement: [x,y]}: {
	addMouseforce: (mouseForce: V2) => void
	movement: V2
}) {
	addMouseforce([x, -y])
}
