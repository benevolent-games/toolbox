
export function packValue(x: any) {
	return (x === undefined)
		? "undefined"
		: JSON.stringify(x)
}
