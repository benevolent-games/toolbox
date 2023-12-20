
// import { TransformNode } from "@babylonjs/core/Meshes/transformNode.js"
// import {Vec3} from "../../tools/math/vec3.js"
// import {Revo} from "./revo.js"

// // export const model = Revo.entity<{}>({
// // 	plugins: [],
// // 	simulate(state) {},
// // 	replicate(state) {},
// // })

// const magic = undefined as any
// const Magic = undefined as any


// export class Humanoid extends Magic {
// 	simulate() {
//
// 	}

// 	replicate() {}
// }

// export const transform = magic.entity(use => {
// 	const position = use.state([0, 0, 0] as Vec3)

// 	const node = use.init(() => {
// 		const n = new TransformNode("", use.scene)
// 		return [n, () => n.dispose()]
// 	})

// 	return node.position.set(...position)
// })

// export const humanoid = magic.entity(use => {
// 	use.init(() => {
// 		const character =
// 		return [character, () => {}]
// 	})
// })

// export const model = magic()
// 	.state<{
// 		container: string
// 	}>()
// 	.mount((base, state) => {
// 		const instance = base.containers[state.container].instantiateToScene()
// 		return {
// 			item: instance,
// 			unmount: () => instance.dispose(),
// 		}
// 	})

