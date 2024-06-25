
import {Vista} from "../../vista.js"
import {nexus} from "../../../ui/nexus.js"
import {css, html, signals, loading} from "@benev/slate"

const styles = css`

:host { display: contents; }

canvas {
	display: block;
	width: 100%;
	height: 100%;
}

`

export const VistaView = nexus.shadowView(use => () => {
	use.name("vista")
	use.styles(styles)

	const {canvas, vistaOp} = use.init(() => {
		const canvas = document.createElement("canvas")
		const vistaOp = signals.op<Vista>()
		const disposed = signals.signal(false)

		vistaOp.load(async() => {
			const vista = await Vista.create({canvas})
			if (disposed.value)
				vista.dispose()
			return vista
		})

		return [{canvas, vistaOp}, () => {
			disposed.value = true
			if (vistaOp.isReady())
				vistaOp.payload.dispose()
		}]
	})

	return loading.binary(vistaOp.value, () => html`
		${canvas}
	`)
})

