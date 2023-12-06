
export function proxyState<X extends {}>(
		data: X,
		onChange: (data: X) => void,
	) {
	const readable = proxyReadable(data)
	const writable = proxyWritable(data, () => onChange(readable))
	return {readable, writable}
}

function isObject(x: any) {
	return x !== null && typeof x === "object"
}

function proxyReadable<X extends {}>(data: X): X {
	return new Proxy(data, {
		get(target: any, key: string) {
			const value = target[key]
			return isObject(value)
				? proxyReadable(value)
				: value
		},
		set(target, key: string, value) {
			throw new Error(`cannot set "${key}" on immutable readable data`)
		},
	})
}

function proxyWritable<X extends {}>(
		data: X,
		onChange: () => void,
	): X {
	return new Proxy(data, {
		get(target: any, key: string) {
			const value = target[key]
			return isObject(value)
				? proxyWritable(value, onChange)
				: value
		},
		set(target: any, key: string, value) {
			target[key] = value
			onChange()
			return true
		},
	})
}
