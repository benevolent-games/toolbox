
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Animations/index.js"

import {register_to_dom} from "@benev/slate"

import {nexus} from "./nexus.js"
import {DanceStudio} from "./dom/elements/studio/element.js"

register_to_dom({DanceStudio})

;(window as any).nexus = nexus

// nexus.context.loader.ingest_glb_from_url("/temp/bungledanimations18.glb")
// await nexus.context.loader.ingest_glb_from_url("/temp/knightanimations9.glb")
await nexus.context.loader.ingest_glb_from_url("https://filebin.net/o9g5lbh4ex6frwrf/knightanimations9.glb")

