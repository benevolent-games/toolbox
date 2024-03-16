
export function inherits(childClass: Function, parentClass: Function) {
	let proto = Object.getPrototypeOf(childClass.prototype)
	while (proto != null) {
		if (proto === parentClass.prototype)
			return true
		proto = Object.getPrototypeOf(proto);
	}
	return false
}

