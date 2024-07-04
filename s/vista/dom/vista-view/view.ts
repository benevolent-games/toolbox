
import {loading} from "@benev/slate"

import {styles} from "./css.js"
import {Vista} from "../../vista.js"
import {nexus} from "../../../ui/nexus.js"
import {FlexCanvas} from "../../parts/flex-canvas.js"
import {EngineSettings} from "../../parts/start-engine.js"

export const VistaView = nexus.shadowView(use => (settings: EngineSettings.Auto) => {
	use.name("vista")
	use.styles(styles)

	const op = use.load(async() => {
		const canvas = document.createElement("canvas")
		const flexCanvas = new FlexCanvas(canvas)
		const vista = new Vista({
			canvas,
			engine: await Vista.engine(settings),
		})
		return {vista, flexCanvas}
	})

	return loading.binary(op, ({vista}) => vista.canvas)
})

