import {v2, V2} from "../../../utils/v2.js"


export function onCameraRotate({getUpdateStarters, addMouseforce, updateCameraRotation}: {
		getUpdateStarters: () => {movement: V2}
		addMouseforce: (mouseForce: V2) => void
		updateCameraRotation: () => void
}) {
		const {movement: [x, y]} = getUpdateStarters()
		addMouseforce([x, -y])
		updateCameraRotation()
	}
