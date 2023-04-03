
import {make_fly_camera} from "../../babylon/flycam/make_fly_camera.js"

export type State = {
	fly_camera: ReturnType<typeof make_fly_camera>
}
