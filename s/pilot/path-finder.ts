
import {Navmesh} from "./types.js"
import {V3, v3} from "../utils/v3.js"



export function makePilot({navmesh}: {
		navmesh: Navmesh
	}) {

	function get(map: Map<number, number>, index: number) {
		return map.get(index) ?? Infinity
	}

	function lowest(open: Set<number>, f: Map<number, number>) {
		let result = Infinity
		for (const index of open) {
			if (get(f, index) <= result)
				result = index
		}
		return result
	}

	function reconstructPath(cameFrom: Map<number, number>, current: number) {
		const path: number[] = []
		while (true) {
			path.unshift(current)
			const parent = cameFrom.get(current)
			if (parent === undefined)
				break
			current = parent
		}
		return path
	}

	const {beacons, edges} = navmesh.pathable

	const randomness_factor = 1.5

	function pathfind(start: number, goal: number) {
		function heuristicCostToGoal(index: number) {
			return v3.distance(beacons[index], beacons[goal])
		}

		// sets and map to keep state about each node
		const openFrontier = new Set<number>([start])
		const parents = new Map<number, number>()
		const gCostOfPathSoFar = new Map<number, number>()
		const fTotalCost = new Map<number, number>()

		// initialize starting node
		gCostOfPathSoFar.set(start, 0)
		fTotalCost.set(start, heuristicCostToGoal(start))

		// keep looping until we reach the goal
		while (openFrontier.size > 0) {
			const current = lowest(openFrontier, fTotalCost)

			if (current === goal)
				return reconstructPath(parents, goal)

			openFrontier.delete(current)
			const neighbors = edges[current].filter(i => !openFrontier.has(i))

			for (const neighbor of neighbors) {
				const previousCostOfPath = get(gCostOfPathSoFar, current)
				const costOfStep = v3.distance(beacons[current], beacons[neighbor])
				const tentativeCost = previousCostOfPath + costOfStep
				if (tentativeCost < get(gCostOfPathSoFar, neighbor)) {
					parents.set(neighbor, current)
					gCostOfPathSoFar.set(neighbor, tentativeCost)
					const random_score = Math.random() * randomness_factor
					const new_f_score = (
						tentativeCost + heuristicCostToGoal(neighbor) + random_score
					)
					fTotalCost.set(neighbor, new_f_score)
					openFrontier.add(neighbor)
				}
			}
		}

		return []
	}

	function findNearestBeacon(point: V3) {
		let nearest: number = 0
		let nearestDistance: number = Infinity
		for (const [index, beacon] of navmesh.pathable.beacons.entries()) {
			if (beacon) {
				const distance = v3.distance(beacon, point)
				if (distance < nearestDistance) {
					nearest = index
					nearestDistance = distance
				}
			}
		}
		return nearest
	}

	function findPath({to, from}: {
			to: V3
			from: V3
		}) {
		const start = findNearestBeacon(from)
		const goal = findNearestBeacon(to)
		const path = pathfind(start, goal)
		return path
	}

	return {pathfind, findPath}

}
