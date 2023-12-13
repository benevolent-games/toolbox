
import {html} from "@benev/slate"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight.js"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Plate} from "../../../../common/models/plate/plate.js"
import {Porthole} from "../../../../common/models/porthole/porthole.js"

export const links = {
	gym: "https://filebin.net/42013ycnu1eav4h6/gym.glb",
	character: "https://filebin.net/yuuj502md0iwfxrn/bungledanimations18.glb",
}

// export const links = {
// 	gym: "/temp/gym.glb",
// 	character: "/temp/bungledanimations18.glb",
// }

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)

	const gymOp = use.op<AssetContainer>()
	const characterOp = use.op<AssetContainer>()

	const {porthole} = use.once(() => {
		const porthole = new Porthole()
		const plate = new Plate(porthole.canvas)

		porthole.resolution = 50 / 100

		const hemi = new HemisphericLight(
			"hemi",
			new Vector3(0.234, 1, 0.123),
			plate.scene,
		)

		hemi.intensity = 0.5

		gymOp.load(async() => plate.load_glb(links.gym))
			.then(container => {
				for (const light of container.lights)
					light.intensity /= 1000
				container.addAllToScene()
			})

		characterOp.load(async() => plate.load_glb(links.character))
			.then(container => {
				container.addAllToScene()
			})

		return {porthole, plate}
	})

	return html`
		<div class=humanoid>
			${porthole.canvas}
		</div>
	`
})

