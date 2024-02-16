
export function inherits(targetClass: Function, baseClass: Function) {
	let proto = Object.getPrototypeOf(targetClass.prototype)
	while (proto != null) {
		if (proto === baseClass.prototype)
			return true
		proto = Object.getPrototypeOf(proto);
	}
	return false
}

