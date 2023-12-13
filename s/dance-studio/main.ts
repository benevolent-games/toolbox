
import {register_to_dom} from "@benev/slate"

import {nexus} from "./nexus.js"
import {DanceStudio} from "./dom/elements/studio/element.js"

register_to_dom({DanceStudio})

// nexus.context.loader.ingest_glb_from_url("https://filebin.net/eomque4qqcqr3nqb/bungledanimations15.glb")

;(window as any).nexus = nexus

