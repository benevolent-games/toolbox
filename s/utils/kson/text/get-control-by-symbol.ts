
import {controls} from "./controls.js"
import {controlSymbols} from "./control-symbols.js"

export function getControlBySymbol(symbol: symbol) {
	const known = (
		Object
			.entries(controlSymbols)
			.find(([,value]) => value === symbol)
	)

	if (!known)
		throw new Error("unknown symbol")

	const [name] = known
	return controls[<keyof typeof controls>name]
}
