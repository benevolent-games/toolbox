
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Animations/index.js"

import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"

import {nexus} from "./nexus.js"
import {register_to_dom} from "@benev/slate"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

