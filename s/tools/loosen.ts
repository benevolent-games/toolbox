
export type Loosen<T> = {
	[P in keyof T]: T[P] extends boolean ? boolean
	: T[P] extends number ? number
	: T[P] extends string ? string
	: T[P] extends Array<infer U> ? Array<Loosen<U>>
	: T[P] extends object ? Loosen<T[P]>
	: T[P]
}

