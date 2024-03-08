
import {Rapier} from "../../rapier.js"
import {prefab} from "../utils/prefab.js"
import {Trashcan} from "../../../tools/trashcan.js"
import {Vec3, vec3} from "../../../math/exports.js"

export const joint_spherical = prefab(physics => (o: {
		anchors: [Vec3, Vec3]
		bodies: [Rapier.RigidBody, Rapier.RigidBody]
	}) => {

	console.log("joint_spherical", o)

	const [a1, a2] = o.anchors
	const [b1, b2] = o.bodies
	const {bag, dispose} = new Trashcan()
	const joint = bag(
		physics.world.createImpulseJoint(
			Rapier.JointData.spherical(
				vec3.to.xyz(a1),
				vec3.to.xyz(a2),
			),
			b1,
			b2,
			true,
		)
	)
	return {joint, dispose}
})

