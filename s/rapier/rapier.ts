
import Rapier from "@dimforge/rapier3d-compat"

await (Rapier as any).init()

export {Rapier}
export * from "./physics.js"
export * from "./prefabs.js"

