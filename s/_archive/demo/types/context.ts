
import {NubContext} from "@benev/nubs"

import {BenevTheater} from "../../babylon/theater/element.js"
import {FlyCameraControlSettings} from "./fly_camera_control_settings.js"

export type Context = {
	nub: NubContext
	theater: BenevTheater
	fly_camera_control_settings: FlyCameraControlSettings
}
