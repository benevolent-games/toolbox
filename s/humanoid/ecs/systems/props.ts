
import {house} from "../house.js"

export const propSystem = house.rezzer(["prop"], ({realm}) => state => {
	const {prop} = state

	if (prop in realm.props) {
		const meshes = realm.props[prop]()
	}
	else {
		console.warn(`prop not found "${prop}"`)
	}

	return {
		update() {},
		dispose() {},
	}
})

