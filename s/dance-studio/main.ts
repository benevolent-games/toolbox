
import {register_to_dom} from "@benev/slate"

import {nexus} from "./nexus.js"
import {DanceStudio} from "./dom/elements/studio/element.js"

register_to_dom({DanceStudio})

nexus.context.loader.ingest_glb_from_url("https://filebin.net/6htk8w8pu62ac3dd/bungledanimations10.glb")

